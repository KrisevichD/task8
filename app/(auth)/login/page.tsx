"use server";

import { Button } from "@/components/ui/button";
import LoginContent from "@/contents/auth/loginContent";
import Link from "next/link";

export default async function LoginPage() {

  return (
    <div className="w-full text-center space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-normal tracking-wide">
          Welcome back
        </h2>
        <p>Hello again! Log in to continue</p>
      </div>

      <LoginContent />

      <Button variant={"ghost"} render={
        <Link
          href="/forgot-password"
        >
          FORGOT PASSWORD
        </Link>
      } />
    </div>
  );
}
