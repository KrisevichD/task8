import { TypedDocumentNode } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { toast } from "sonner";

import { useMe } from "../auth/useMe";

import { useLanguage } from "@/context/language";
import { ICreateCvData, ICreateCvInput, ICreateCvVariables } from "@/types/cvs";

export default function useCreateCv(
  mutation: TypedDocumentNode<ICreateCvData, ICreateCvVariables>,
) {
  const { t } = useLanguage();
  const { user } = useMe();
  const userId = user?.id;
  const router = useRouter();
  const [errorText, setErrorText] = useState("");

  const [executeCreateCv, { loading: isLoading }] = useMutation(mutation);

  const createCv = async (input: Omit<ICreateCvInput, "userId">) => {
    if (!userId) return;
    const data = {
      userId: userId,
      ...input,
    };
    try {
      const promise = executeCreateCv({ variables: { cv: data } });
      toast.promise(promise, {
        loading: `${t("adding")} CV...`,
        success: `CV ${t("successfully")} ${t("added")}!`,
        error: (err) => `${t("errorMessage")} ${err.message}`,
        position: "top-right",
      });
      const result = await promise;

      if (result.error) {
        const message = result.error.message || "An error occurred.";
        throw new Error(message);
      }

      if (!result.data) throw new Error("No data");
      router.push(`/cvs/${result.data.createCv.id}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setErrorText(message);
      throw err;
    }
  };

  return { createCv, isLoading, errorText };
}
