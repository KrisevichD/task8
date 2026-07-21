"use client";

import { OperationVariables } from "@apollo/client";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { FloatingInput } from "@/components/ui/floating-input";
import { Icon } from "@/components/ui/icon";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group";

import { cn } from "@/utils/shadcn";

type TAuthFormProps = {
  className?: string;
  onSubmit: (variables: OperationVariables) => Promise<void>;
  isLoading: boolean;
  errorText: string;
  buttonText: string;
};

const AuthForm = ({
  className,
  onSubmit,
  isLoading,
  errorText,
  buttonText,
}: TAuthFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isShowPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({ auth: { email, password } });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("space-y-5 max-w-md mx-auto", className)}
    >
      {errorText && (
        <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 p-3 text-center">
          {errorText}
        </div>
      )}

      <FloatingInput
        type="email"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isLoading}
        required
      />
      <InputGroup>
        <InputGroupInput
          id="login:password"
          type={isShowPassword ? "text" : "password"}
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          required
        />
        <InputGroupAddon align="inline-end">
          <Button
            variant="ghost"
            size="icon"
            onMouseDown={() => setShowPassword(true)}
            onMouseUp={() => setShowPassword(false)}
            onMouseLeave={() => setShowPassword(false)}
            onTouchStart={() => setShowPassword(true)}
            onTouchEnd={() => setShowPassword(false)}
            disabled={isLoading}
          >
            <Icon variant="eye" label="Show password" />
          </Button>
        </InputGroupAddon>
      </InputGroup>

      {/* Кнопка отправки формы */}
      <Button
        type="submit"
        variant="primary"
        size="default"
        className="mt-10 uppercase"
        disabled={isLoading}
      >
        {isLoading ? "..." : buttonText}
      </Button>
    </form>
  );
};

export default AuthForm;
