"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import { cn } from "@/utils/shadcn";

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
    <div className="flex min-h-screen flex-col bg-[#444444] text-white font-sans">
      {!isForgot && (
        <div className="flex justify-center border-b border-zinc-700/50 bg-[#444444]">
          <div className="flex w-full max-w-md">
            <Link
              href="/login"
              className={cn(
                "w-1/2 text-center py-4 text-xs font-semibold uppercase tracking-widest border-b-2 transition-all",
                isLogin
                  ? "border-red-600 text-red-500"
                  : "border-transparent text-gray-400 hover:text-gray-200",
              )}
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className={cn(
                "w-1/2 text-center py-4 text-xs font-semibold uppercase tracking-widest border-b-2 transition-all",
                isSignup
                  ? "border-red-600 text-red-500"
                  : "border-transparent text-gray-400 hover:text-gray-200",
              )}
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">{children}</div>
      </div>
    </div>
  );
}
