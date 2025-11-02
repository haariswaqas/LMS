'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Users, Map } from "lucide-react";

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "My Tutors", href: "/companions", icon: Users },
  { label: "Learning Path", href: "/my-journey", icon: Map },
];

const NavItems = () => {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center gap-2">
      {navItems.map(({ label, href, icon: Icon }) => {
        const isActive = pathname === href;

        return (
          <Link
            key={label}
            href={href}
            className={cn(
              "group relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-300 hover:scale-105",
              isActive
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white shadow-lg shadow-blue-500/30"
                : "text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-600 dark:hover:text-blue-400"
            )}
          >
            <Icon className={cn(
              "h-4 w-4 transition-transform group-hover:scale-110",
              isActive && "text-white"
            )} />
            <span>{label}</span>
            {isActive && (
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 opacity-0 blur-xl group-hover:opacity-30 transition-opacity" />
            )}
          </Link>
        );
      })}
    </nav>
  );
};

export default NavItems;