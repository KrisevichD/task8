"use client";

import AuthForm from "../../components/auth-form";

import { SIGN_IN_QUERY } from "@/graphql/auth/mutations";
import { useLogin } from "@/hooks/auth/useLogin";

type TLoginContentProps = {
  className?: string;
};

const LoginContent = ({ className }: TLoginContentProps) => {
  const { login, isLoading, errorText } = useLogin(SIGN_IN_QUERY);

  return (
    <AuthForm
      className={className}
      onSubmit={login}
      isLoading={isLoading}
      errorText={errorText}
      buttonText="log in"
    />
  );
};

export default LoginContent;
