'use client'; // Mark this as a Client Component

import { useSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button'; // Assuming you're using shadcn/ui
import Link from 'next/link';

export default function LoginPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!isLoaded) return;

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.push('/dashboard'); // Redirect to dashboard after login
      }
    } catch (err) {
      console.error('Error during sign-in:', err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Login</h2>
        <div className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
            required
          />
          <Button type="submit" className="w-full">
            Login
          </Button>
        </div>
        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            Don’t have an account?{' '}
            <Link href="/signup" className="text-blue-600 dark:text-blue-400 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}