import { OperationVariables, TypedDocumentNode } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useState } from "react";

export function useForgotPassword<TData, TVariables extends OperationVariables>(
  mutation: TypedDocumentNode<TData, TVariables>,
  successText = "Instructions have been sent if the email exists.",
) {
  const [errorText, setErrorText] = useState("");

  const [executeReset, { loading: isLoading }] = useMutation(mutation);

  const resetPassword = async (variables: TVariables) => {
    setErrorText("");

    try {
      const result = await executeReset({ variables });

      if (result.error) {
        const message = result.error.message || "Failed to send reset link.";
        setErrorText(message);
        throw new Error(message);
      }

      setErrorText("");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setErrorText(message);
      throw err;
    }
  };

  return { resetPassword, isLoading, errorText, successText };
}
