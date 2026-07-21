import { OperationVariables, TypedDocumentNode } from "@apollo/client";
import { useLazyQuery } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ILoginResponse } from "@/types/auth";

export function useLogin<
  TData extends ILoginResponse,
  TVariables extends OperationVariables,
>(query: TypedDocumentNode<TData, TVariables>, redirectTo = "/employees") {
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
        setErrorText(result.error.message || "An error occurred during login.");
        return;
      }

      const authData = result.data?.login;

      if (authData?.access_token && authData?.refresh_token) {
        localStorage.setItem("access_token", authData.access_token);
        localStorage.setItem("refresh_token", authData.refresh_token);
        router.push(redirectTo);
      }
    } catch (err) {
      setErrorText(err instanceof Error ? err.message : "Unknown error");
    }
  };

  return { login, isLoading, errorText };
}
