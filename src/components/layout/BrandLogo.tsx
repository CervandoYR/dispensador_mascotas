"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Bone } from "lucide-react";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  href?: string;
  showVersion?: boolean;
  className?: string;
}

export default function BrandLogo({
  href = "/",
  className,
}: BrandLogoProps) {
  const content = (
    <>
      <motion.div
        className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 shrink-0"
        animate={{
          boxShadow: [
            "0 0 0 0 rgba(16,185,129,0)",
            "0 0 12px 2px rgba(16,185,129,0.15)",
            "0 0 0 0 rgba(16,185,129,0)",
          ],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <Bone className="h-4 w-4 text-emerald-600 dark:text-emerald-400" strokeWidth={1.5} />
      </motion.div>
      <span className="text-sm font-bold tracking-tight text-zinc-900 dark:text-white">
        PetFeeder
        <span className="brand-pro ml-0.5">Pro</span>
      </span>
    </>
  );

  const wrapperClass = cn("flex items-center gap-2.5 group", className);

  if (href) {
    return (
      <Link href={href} className={wrapperClass}>
        {content}
      </Link>
    );
  }

  return <div className={wrapperClass}>{content}</div>;
}
