import { TypedDocumentNode } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ICreateCvData, ICreateCvVariables } from "@/types/cvs";

export default function useCreateCv(
  mutation: TypedDocumentNode<ICreateCvData, ICreateCvVariables>,
) {
  const router = useRouter();
  const [errorText, setErrorText] = useState("");

  const [executeCreateCv, { loading: isLoading }] = useMutation(mutation);

  const createCv = async (variables: ICreateCvVariables) => {
    setErrorText("");
    try {
      const result = await executeCreateCv({ variables });

      if (result.error) {
        const message = result.error.message || "An error occurred.";
        setErrorText(message);
        throw new Error(message);
      }

      if (!result.data) throw new Error("No data");
      console.log(result);
      router.push(`/cvs/${result.data.createCv.id}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setErrorText(message);
      throw err;
    }
  };

  return { createCv, isLoading, errorText };
}
