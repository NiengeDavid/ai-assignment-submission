// pages/api/webhooks/clerk.ts
import { Webhook } from "svix";
import { getClient } from "@/sanity/lib/sanity.client";
import { writeToken } from "@/sanity/lib/sanity.api";

import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const client = getClient({ token: writeToken });
  if (!process.env.CLERK_WEBHOOK_SECRET) {
    throw new Error(
      "CLERK_WEBHOOK_SECRET is not defined in environment variables."
    );
  }
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

  try {
    const payload = wh.verify(req.body, req.headers as Record<string, string>);
    const user = (payload as { data: any }).data;

    const userDoc = {
      _id: `user-${user.id}`,
      _type: "user",
      userId: user.id,
      fullName:
        user.unsafe_metadata.fullName || `${user.first_name} ${user.last_name}`,
      role: (user.unsafe_metadata.role || "student").toLowerCase(),
      image: {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: user.image_url,
        },
      },
      contact: {
        _type: "object",
        email:
          user.unsafe_metadata.email || user.email_addresses[0]?.email_address,
        phoneNumber: user.unsafe_metadata.phoneNumber,
      },
      academic: {
        _type: "object",
        faculty: {
          _type: "reference",
          _ref: user.unsafe_metadata.faculty,
        },
        department: {
          _type: "reference",
          _ref: user.unsafe_metadata.department,
        },
        ...(user.unsafe_metadata.role === "student" && {
          level: user.unsafe_metadata.level,
          regNumber: user.unsafe_metadata.registrationNumber,
        }),
        ...(user.unsafe_metadata.role !== "student" && {
          staffId: user.unsafe_metadata.idNumber,
        }),
      },
      authStatus: "pending",
    };

    await client
      .transaction()
      .createIfNotExists(userDoc)
      .patch(`user-${user.id}`, (p) => p.set(userDoc))
      .commit();

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Webhook processing failed:", err);
    res.status(500).json({
      error: err instanceof Error ? err.message : "An unknown error occurred",
    });
  }
}
