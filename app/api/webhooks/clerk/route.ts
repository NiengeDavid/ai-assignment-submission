import { Webhook } from "svix";
import { getClient } from "@/sanity/lib/sanity.client";
import { writeToken } from "@/sanity/lib/sanity.api";

export const POST = async (req: Request) => {
  const client = getClient({ token: writeToken });

  if (!process.env.CLERK_WEBHOOK_SECRET) {
    throw new Error(
      "CLERK_WEBHOOK_SECRET is not defined in environment variables."
    );
  }

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

  try {
    const body = await req.text(); // Read the raw body for verification
    const headers = Object.fromEntries(req.headers.entries()); // Convert headers to an object
    const payload = wh.verify(body, headers);
    const user = (payload as { data: any }).data;

    // Upload image to Sanity and get the asset ID
    const uploadImage = async (imageUrl: string) => {
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      const asset = await client.assets.upload("image", blob, {
        filename: "user-profile-image",
      });

      return asset._id; // Return the asset ID
    };

    const imageRef = user.image_url
      ? await uploadImage(user.image_url)
      : undefined;

    const fullName =
      user.unsafe_metadata?.fullName ||
      (user.first_name && user.last_name
        ? `${user.first_name} ${user.last_name}`
        : "Unknown User");

    // Helper function to fetch the document ID by name
    const getReferenceId = async (
      type: string,
      name: string
    ): Promise<string | undefined> => {
      const query = `*[_type == $type && name == $name][0]._id`;
      const params = { type, name };
      const result = await client.fetch(query, params);
      return result; // Returns the _id or undefined if not found
    };

    const facultyId = user.unsafe_metadata?.faculty
      ? await getReferenceId("faculty", user.unsafe_metadata.faculty)
      : undefined;

    const departmentId = user.unsafe_metadata?.department
      ? await getReferenceId("department", user.unsafe_metadata.department)
      : undefined;

    const email =
      user.unsafe_metadata?.email ||
      (user.email_addresses.length > 0
        ? user.email_addresses[0].email_address
        : "Unknown Email");

    const userDoc = {
      _id: `user-${user.id}`,
      _type: "user",
      userId: user.id,
      fullName: fullName,
      role: (user.unsafe_metadata?.role || "student").toLowerCase(),
      image: imageRef
        ? {
            _type: "image",
            asset: {
              _type: "reference",
              _ref: imageRef,
            },
          }
        : undefined,
      contact: {
        _type: "object",
        email: email,
        phoneNumber: user.unsafe_metadata?.phoneNumber,
      },
      academic: {
        _type: "object",
        faculty: facultyId
          ? {
              _type: "reference",
              _ref: facultyId,
            }
          : undefined,
        department: departmentId
          ? {
              _type: "reference",
              _ref: departmentId,
            }
          : undefined,
        ...(user.unsafe_metadata?.role === "student" && {
          level: user.unsafe_metadata?.level,
          regNumber: user.unsafe_metadata?.registrationNumber,
        }),
        ...(user.unsafe_metadata?.role !== "student" && {
          staffId: user.unsafe_metadata?.idNumber,
        }),
      },
      authStatus: "pending",
    };

    await client
      .transaction()
      .createIfNotExists(userDoc)
      .patch(`user-${user.id}`, (p) => p.set(userDoc))
      .commit();

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("Webhook processing failed:", err);
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : "An unknown error occurred",
      }),
      { status: 500 }
    );
  }
};
