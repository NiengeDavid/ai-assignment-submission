// app/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button"; // using shadcn/ui
import Image from "next/image";

const Bg = "/assets/bg.png";

export default function Home() {
  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-bg1 p-4 md:mx-auto md:flex-row md:items-center md:justify-center md:space-x-12">
      {/* Details block */}
      <div className="text-center max-w-2xl md:text-left md:max-w-md">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
          Welcome!
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Submit assignments, track progress, and receive feedback—all in one
          place.
        </p>
        <div className="flex flex-row gap-4 justify-center md:justify-start">
          <Link href="/login">
            <Button className="w-full sm:w-auto cursor-pointer">Login</Button>
          </Link>
          <Link href="/signup">
            <Button
              variant="outline"
              className="w-full sm:w-auto cursor-pointer"
            >
              Sign Up
            </Button>
          </Link>
        </div>
      </div>

      {/* Background Image */}
      <div className="w-full max-w-md mt-8 md:mt-0 md:max-w-md lg:max-w-2xl">
        <Image
          src={Bg}
          alt="Background image"
          height={960}
          width={719}
          className="rounded-xl"
        />
      </div>
    </div>
  );
}
