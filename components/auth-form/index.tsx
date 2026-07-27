"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";

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

export interface IAppError {
  message: string;
}

type TAuthFormProps = {
  className?: string;
  onSubmit: (variables: {
    auth: { email: string; password?: string };
  }) => Promise<void>;
  isLoading: boolean;
  errorText?: string;
  buttonText: string;
  showPasswordInput?: boolean;
  successText?: string;
};

const AuthForm = ({
  className,
  onSubmit,
  isLoading,
  buttonText,
  showPasswordInput = true,
  successText = "Operation completed successfully!",
}: TAuthFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);
  const isInteractingWithMouse = useRef(false);

  const startShowPassword = () => {
    isInteractingWithMouse.current = true;
    setIsShowPassword(true);
  };

  const stopShowPassword = () => {
    if (isInteractingWithMouse.current) {
      setIsShowPassword(false);
      isInteractingWithMouse.current = false;
    }
  };

  const toggleShowPassword = (e: React.MouseEvent) => {
    if (e.detail === 0) {
      setIsShowPassword((prev) => !prev);
    }
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const authPayload = showPasswordInput ? { email, password } : { email };

    const formPromise = onSubmit({ auth: authPayload });

    toast.promise(formPromise, {
      position: "top-right",
      loading: "Sending request...",
      success: successText,
      error: (err: IAppError | Error | unknown) => {
        if (err && typeof err === "object" && "message" in err) {
          return (err as IAppError).message;
        }
        return "An unexpected error occurred";
      },
    });
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

      {showPasswordInput && (
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
              onClick={toggleShowPassword}
              disabled={isLoading}
            >
              <Icon variant="eye" label="Show password" />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      )}

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
