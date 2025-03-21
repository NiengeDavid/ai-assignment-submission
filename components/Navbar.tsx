// components/Navbar.tsx
'use client'; // Mark this as a Client Component

import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  return (
    <nav className="p-4 border-b dark:border-gray-800">
      <div className="flex justify-end">
        <ThemeToggle />
      </div>
    </nav>
  );
}