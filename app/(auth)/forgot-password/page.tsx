"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { FORGOT_PASSWORD_MUTATION } from "@/graphql/auth/mutations";
import { useForgotPassword } from "@/hooks/auth/useForgotPassword";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const { resetPassword, isLoading, errorText, successText } =
    useForgotPassword(FORGOT_PASSWORD_MUTATION);

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    resetPassword({ auth: { email } });
  };

  return (
    <div className="w-full text-center space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-normal tracking-wide text-gray-200">
          Forgot password
        </h2>
        <p className="text-sm text-zinc-400">
          We will sent you an email with further instructions
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
        {errorText && (
          <div className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 p-3 text-center">
            {errorText}
          </div>
        )}

        {successText && (
          <div className="text-sm text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 p-3 text-center">
            {successText}
          </div>
        )}

        <InputGroup>
          <InputGroupInput
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
          />
        </InputGroup>

        <div className="pt-4 flex justify-center">
          <Button
            type="submit"
            variant="primary"
            size="default"
            disabled={isLoading}
            className="uppercase font-medium tracking-widest text-sm"
          >
            {isLoading ? "Sending..." : "Reset Password"}
          </Button>
        </div>
      </form>

      <div className="pt-2">
        <Link
          href="/login"
          className="text-xs text-zinc-500 hover:text-zinc-300 transition uppercase tracking-widest"
        >
          Cancel
        </Link>
      </div>
    </div>
  );
}
