"use server";

import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import ForgotContent from "@/contents/forgot";
import { cn } from "@/utils/shadcn";

export default async function ForgotPasswordPage() {
  return (
    <div className="w-full text-center">
      <h2 className="mb-6.5 text-[34px] font-normal tracking-wide">
        Forgot password
      </h2>
      <p className="mb-10 text-[16px] font-normal">
        We will sent you an email with further instructions
      </p>

      <ForgotContent className="mb-2" />

      <Link href="/login" className={cn(buttonVariants({ variant: "ghost" }))}>
        CANCEL
      </Link>
    </div>
  );
}
