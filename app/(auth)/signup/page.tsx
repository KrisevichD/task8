"use server";

import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import SignUpContent from "@/contents/signup";
import { cn } from "@/utils/shadcn";

export default async function SignupPage() {
  return (
    <div className="w-full text-center">
      <h2 className="mb-6.5 text-[34px] font-normal tracking-wide">
        Register now
      </h2>
      <p className="mb-10 text-[16px] font-normal">
        Welcome! Sign up to continue
      </p>

      <SignUpContent className="mb-2" />

      <Link
        href="/forgot-password"
        className={cn(buttonVariants({ variant: "ghost" }))}
      >
        FORGOT PASSWORD
      </Link>
    </div>
  );
}
