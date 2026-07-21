"use client";

import AuthForm from "../../components/auth-form";

import { FORGOT_PASSWORD_MUTATION } from "@/graphql/auth/mutations";

import { useForgotPassword } from "@/hooks/auth/useForgotPassword";

type TForgotContentProps = {
  className?: string;
};

const ForgotContent = ({ className }: TForgotContentProps) => {
  const { resetPassword, isLoading, errorText } =
    useForgotPassword(FORGOT_PASSWORD_MUTATION);

  return (
    <AuthForm
      className={className}
      onSubmit={resetPassword}
      isLoading={isLoading}
      errorText={errorText}
      buttonText="reset password"
    />
  );
};

export default ForgotContent;
