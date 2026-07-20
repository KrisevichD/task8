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
import { SIGN_IN_QUERY } from "@/graphql/auth/mutations";
import { useLogin } from "@/hooks/auth/useLogin";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isShowPassword, setShowPassword] = useState(false);

  const { login, isLoading, errorText } = useLogin(SIGN_IN_QUERY);

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    login({ auth: { email, password } });
  };

  return (
    <div className="w-full text-center space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-normal tracking-wide text-gray-200">
          Welcome back
        </h2>
        <p className="text-sm text-zinc-400">Hello again! Log in to continue</p>
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

        {/* Кнопка отправки формы */}
        <div className="pt-4 flex justify-center">
          <Button
            type="submit"
            variant="primary"
            size="default"
            disabled={isLoading}
            className="uppercase font-medium tracking-widest text-sm"
          >
            {isLoading ? "Logging in..." : "Log In"}
          </Button>
        </div>
      </form>

      <div className="pt-2">
        <Link
          href="/forgot-password"
          className="text-xs text-zinc-500 hover:text-zinc-300 transition uppercase tracking-widest"
        >
          Forgot Password
        </Link>
      </div>
    </div>
  );
}
