"use client";

import { OperationVariables } from "@apollo/client";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { FloatingInput } from "@/components/ui/floating-input";
import { Icon } from "@/components/ui/icon";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
} from "@/components/ui/input-group";

import { cn } from "@/utils/shadcn";
import { toast } from "sonner";

type TAuthFormProps = {
  className?: string;
  onSubmit: (variables: { auth: { email: string; password: string } }) => Promise<void>;
  isLoading: boolean;
  errorText: string;
  buttonText: string;
};

const AuthForm = ({
  className,
  onSubmit,
  isLoading,
  buttonText,
}: TAuthFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);
  const isInteractingWithMouse = useRef(false);

  const startShowPassword = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    isInteractingWithMouse.current = true;
    setIsShowPassword(true);
  };

  const stopShowPassword = () => {
    if (isInteractingWithMouse.current) {
      setIsShowPassword(false);
      isInteractingWithMouse.current = false;
    }
  };

  const handleToggleClick = (e: React.MouseEvent) => {
    if (e.detail === 0) {
      setIsShowPassword((prev) => !prev);
    }
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formPromise = onSubmit({ auth: { email, password } });

    toast.promise(formPromise, {
        position: "top-right",
        loading: "Loading...",
        success: "Success",
        error: (err) => err.message || "Error"
    })
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("space-y-5 max-w-md mx-auto", className)}
    >
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
          <InputGroupButton
            variant="ghost"
            size="icon"
            type="button"
            onMouseDown={startShowPassword}
            onMouseUp={stopShowPassword}
            onMouseLeave={stopShowPassword}
            onTouchStart={startShowPassword}
            onTouchEnd={stopShowPassword}
            onClick={handleToggleClick}
            disabled={isLoading}
          >
            <Icon variant="eye" label="Show password" />
          </InputGroupButton>
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
        {buttonText}
      </Button>
    </form>
  );
};

export default AuthForm;
