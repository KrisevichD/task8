import { OperationVariables, TypedDocumentNode } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ISignupResponse } from "@/types/auth";

export function useSignup<
  TData extends ISignupResponse,
  TVariables extends OperationVariables,
>(
  mutation: TypedDocumentNode<TData, TVariables>,
  redirectTo = "/employees",
  successText = "Account created successfully!",
) {
  const router = useRouter();
  const [errorText, setErrorText] = useState("");

  const [executeSignup, { loading: isLoading }] = useMutation(mutation);

  const signup = async (variables: TVariables) => {
    setErrorText("");
    try {
      const result = await executeSignup({ variables });

      if (result.error) {
        const message =
          result.error.message || "An error occurred during registration.";
        setErrorText(message);
        throw new Error(message);
      }

      const authData = result.data?.signup;

      if (authData?.access_token && authData?.refresh_token) {
        Cookies.set("access_token", authData.access_token, { expires: 7 });
        Cookies.set("refresh_token", authData.refresh_token, { expires: 7 });
        router.push(redirectTo);
      } else {
        const noTokenError = "Invalid response structure from server.";
        setErrorText(noTokenError);
        throw new Error(noTokenError);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setErrorText(message);
      throw err;
    }
  };

  return { signup, isLoading, errorText, successText };
}
