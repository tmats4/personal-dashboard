"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Dashboard", href: "/" },
  { name: "Tasks", href: "/tasks" },
  { name: "Calendar", href: "/calendar" },
  { name: "Spotify", href: "/spotify" },
  { name: "Weather", href: "/weather" },
];

export default function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="border-b border-zinc-800 bg-zinc-950 text-zinc-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="text-lg font-bold tracking-tight">
          Personal Dashboard
        </Link>

        <nav className="flex flex-wrap gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-3 py-2 text-sm transition ${
                  isActive
                    ? "bg-zinc-100 text-zinc-950"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}