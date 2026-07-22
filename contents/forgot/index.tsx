"use client";

import AuthForm from "../../components/auth-form";

import { FORGOT_PASSWORD_MUTATION } from "@/graphql/auth/mutations";

import { useForgotPassword } from "@/hooks/auth/useForgotPassword";

type TForgotContentProps = {
  className?: string;
};

const ForgotContent = ({ className }: TForgotContentProps) => {
  const { resetPassword, isLoading, errorText, successText } =
    useForgotPassword(FORGOT_PASSWORD_MUTATION);

  return (
    <AuthForm
      className={className}
      onSubmit={resetPassword}
      isLoading={isLoading}
      errorText={errorText}
      successText={successText}
      buttonText="reset password"
      showPasswordInput={false}
    />
  );
};

export default ForgotContent;
