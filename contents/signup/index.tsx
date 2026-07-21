"use client";

import AuthForm from "../../components/auth-form";

import { SIGN_UP_MUTATION } from "@/graphql/auth/mutations";

import { useSignup } from "@/hooks/auth/useSignup";

type TSignUpContentProps = {
  className?: string;
};

const SignUpContent = ({ className }: TSignUpContentProps) => {
  const { signup, isLoading, errorText } = useSignup(SIGN_UP_MUTATION);

  return (
    <AuthForm
      className={className}
      onSubmit={signup}
      isLoading={isLoading}
      errorText={errorText}
      buttonText="log in"
    />
  );
};

export default SignUpContent;
