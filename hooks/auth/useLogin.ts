import { OperationVariables, TypedDocumentNode } from "@apollo/client";
import { useLazyQuery } from "@apollo/client/react";
import Cookies from "js-cookie";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { ILoginResponse } from "@/types/auth";

export function useLogin<
  TData extends ILoginResponse,
  TVariables extends OperationVariables,
>(
  query: TypedDocumentNode<TData, TVariables>,
  redirectTo = "/employees",
  successText = "Welcome back! Successfully logged in",
) {
  const router = useRouter();
  const [errorText, setErrorText] = useState("");

  const [executeLogin, { loading: isLoading }] = useLazyQuery(query, {
    fetchPolicy: "network-only",
  });

  const login = async (variables: TVariables) => {
    setErrorText("");

    try {
      const result = await executeLogin({ variables });

      if (result.error) {
        const message =
          result.error.message || "An error occurred during login.";
        setErrorText(message);
        throw new Error(message);
      }

      const authData = result.data?.login;

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

  return { login, isLoading, errorText, successText };
}
