"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PawPrint, LayoutDashboard, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/settings", label: "Configuración", icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.removeItem("petfeeder_user");
    localStorage.removeItem("petfeeder_schedules");
    window.location.href = "/";
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/70 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 group"
          >
            <div className="p-1.5 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl shadow-md group-hover:shadow-lg transition-shadow">
              <PawPrint className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              PetFeeder{" "}
              <span className="gradient-text">Pro</span>
            </span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-blue-50 text-blue-700 shadow-sm"
                      : "text-muted-foreground hover:bg-slate-100 hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-all duration-200 ml-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
