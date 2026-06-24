"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/layout/ThemeToggle";
import BrandLogo from "@/components/layout/BrandLogo";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/settings", label: "Configuración", icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.removeItem("petfeeder_user");
    localStorage.removeItem("petfeeder_schedules");
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-white/[0.04] bg-white/60 dark:bg-black/60 backdrop-blur-xl transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <BrandLogo href="/dashboard" />

          <div className="flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200",
                    isActive
                      ? "bg-zinc-100 text-zinc-900 dark:bg-white/[0.08] dark:text-white"
                      : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800 dark:text-white/40 dark:hover:bg-white/[0.04] dark:hover:text-white/70"
                  )}
                >
                  <item.icon className="h-3.5 w-3.5" strokeWidth={1.5} />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
            
            <div className="mx-1.5 h-4 w-px bg-zinc-200 dark:bg-white/10" />

            <ThemeToggle />

            <motion.button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:bg-red-500/10 hover:text-red-500 dark:text-white/30 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-all duration-200 ml-1 cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
            >
              <LogOut className="h-3.5 w-3.5" strokeWidth={1.5} />
              <span className="hidden sm:inline">Salir</span>
            </motion.button>
          </div>
        </div>
      </div>
    </nav>
  );
}
