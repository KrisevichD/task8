"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import { cn } from "@/utils/shadcn";
import { Toaster } from "@/components/ui/sonner";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLogin = pathname === "/login";
  const isSignup = pathname === "/signup";
  const isForgot = pathname === "/forgot-password";

  return (
    <div className={cn("flex min-h-screen flex-col", isForgot && "pt-14")}>
      {!isForgot && (
        <header className="flex justify-center pt-1.5">
          <Link
            href="/login"
            className={cn(
              "w-37.5 h-12.5 text-center py-4 text-xs font-semibold uppercase border-b-2 border-transparent tracking-widest transition-colors hover:bg-input/8",
              isLogin && "border-primary text-primary",
            )}
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className={cn(
              "w-37.5 h-12.5 text-center py-4 text-xs font-semibold uppercase border-b-2 border-transparent tracking-widest transition-colors hover:bg-input/8",
              isSignup && "border-primary text-primary",
            )}
          >
            Sign Up
          </Link>
        </header>
      )}

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">{children}</div>
      </div>
    </div>
  );
}
