"use server";

import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import LoginContent from "@/contents/login";
import { cn } from "@/utils/shadcn";

export default async function LoginPage() {
  return (
    <div className="w-full text-center">
      <h2 className="mb-6.5 text-[34px] font-normal tracking-wide">
        Welcome back
      </h2>
      <p className="mb-10 text-[16px] font-normal">
        Hello again! Log in to continue
      </p>

      <LoginContent className="mb-2" />

      <Link
        href="/forgot-password"
        className={cn(buttonVariants({ variant: "ghost" }))}
      >
        FORGOT PASSWORD
      </Link>
    </div>
  );
}
