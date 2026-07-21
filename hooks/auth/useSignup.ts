import { OperationVariables, TypedDocumentNode } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ISignupResponse } from "@/types/auth";

export function useSignup<
  TData extends ISignupResponse,
  TVariables extends OperationVariables,
>(mutation: TypedDocumentNode<TData, TVariables>, redirectTo = "/employees") {
  const router = useRouter();
  const [errorText, setErrorText] = useState("");

  const [executeSignup, { loading: isLoading }] = useMutation(mutation);

  const signup = async (variables: TVariables) => {
    setErrorText("");
    try {
      const result = await executeSignup({ variables });

      if (result.error) {
        setErrorText(
          result.error.message || "An error occurred during registration.",
        );
        return;
      }

      const authData = result.data?.signup;

      if (authData?.access_token && authData?.refresh_token) {
        localStorage.setItem("access_token", authData.access_token);
        localStorage.setItem("refresh_token", authData.refresh_token);
        router.push(redirectTo);
      }
    } catch (err) {
      setErrorText(err instanceof Error ? err.message : "Unknown error");
      throw err;
    }
  };

  return { signup, isLoading, errorText };
}
