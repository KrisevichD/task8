"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
} from "@/components/ui/input-group";
import { SIGN_UP_MUTATION } from "@/graphql/auth/mutations";
import { useSignup } from "@/hooks/auth/useSignup";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isShowPassword, setShowPassword] = useState(false);

  const { signup, isLoading, errorText } = useSignup(SIGN_UP_MUTATION);

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    signup({ auth: { email, password } });
  };

  return (
    <div className="w-full text-center space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-normal tracking-wide text-gray-200">
          Register now
        </h2>
        <p className="text-sm text-zinc-400">Welcome! Sign up to continue</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
        {errorText && (
          <div className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 p-3 text-center">
            {errorText}
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

        <InputGroup>
          <InputGroupInput
            type={isShowPassword ? "text" : "password"}
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
          />
          <InputGroupAddon align="inline-end" className="pr-2">
            <InputGroupButton
              variant="ghost"
              size="icon-xs"
              onClick={() => setShowPassword(!isShowPassword)}
              disabled={isLoading}
              title={isShowPassword ? "Hide password" : "Show password"}
            >
              <Icon
                variant="eye"
                size="sm"
                className={`transition-colors ${
                  isShowPassword
                    ? "text-white"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>

        <div className="pt-4 flex justify-center">
          <Button
            type="submit"
            variant="primary"
            size="default"
            disabled={isLoading}
            className="uppercase font-medium tracking-widest text-sm"
          >
            {isLoading ? "Creating..." : "Create Account"}
          </Button>
        </div>
      </form>

      <div className="pt-2">
        <Link
          href="/login"
          className="text-xs text-zinc-500 hover:text-zinc-300 transition uppercase tracking-widest"
        >
          I have an account
        </Link>
      </div>
    </div>
  );
}
