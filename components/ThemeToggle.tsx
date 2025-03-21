// components/ThemeToggle.tsx
'use client'; // Mark this as a Client Component

import { useTheme } from "@/app/useTheme";
import { Button } from './ui/button'; // using shadcn/ui

export default function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <div className="flex gap-2">
      <Button onClick={() => setTheme('light')} variant="ghost" size="sm">
        Light
      </Button>
      <Button onClick={() => setTheme('dark')} variant="ghost" size="sm">
        Dark
      </Button>
      <Button onClick={() => setTheme('system')} variant="ghost" size="sm">
        System
      </Button>
    </div>
  );
}