import { OperationVariables, TypedDocumentNode } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useState } from "react";

export function useForgotPassword<TData, TVariables extends OperationVariables>(
  mutation: TypedDocumentNode<TData, TVariables>,
) {
  const [errorText, setErrorText] = useState("");
  const [successText, setSuccessText] = useState("");

  const [executeReset, { loading: isLoading }] = useMutation(mutation);

  const resetPassword = async (variables: TVariables) => {
    setErrorText("");
    setSuccessText("");

    try {
      const result = await executeReset({ variables });

      if (result.error) {
        setErrorText(result.error.message || "Failed to send reset link.");
        return;
      }

      setErrorText("");
      setSuccessText("Instructions have been sent if the email exists.");
    } catch (err) {
      setErrorText(err instanceof Error ? err.message : "Unknown error");
    }
  };

  return { resetPassword, isLoading, errorText, successText };
}
