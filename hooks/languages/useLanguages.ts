import { useLazyQuery, useMutation } from "@apollo/client/react";

import { toast } from "sonner";

import {
  ADD_PROFILE_LANGUAGE,
  DELETE_PROFILE_LANGUAGE,
  GET_ALL_LANGUAGES,
  UPDATE_PROFILE_LANGUAGE,
} from "@/graphql/languages";
import { IProfileLanguage } from "@/types/languages";
import { getUserIdFromToken } from "@/utils/jwt";

export default function useLanguages(customUserId: string) {
  const userId = customUserId || getUserIdFromToken() || "";
  const [getAllLanguages, { data: languages, loading: isLanguagesLoading }] =
    useLazyQuery(GET_ALL_LANGUAGES);
  const [executeAddProfileLanguage, { loading: isAddingLoading }] =
    useMutation(ADD_PROFILE_LANGUAGE);
  const [executeUpdateProfileLanguage] = useMutation(UPDATE_PROFILE_LANGUAGE);
  const [executeDeleteProfileLanguages, { loading: isUpdatingLoading }] =
    useMutation(DELETE_PROFILE_LANGUAGE);

  const addProfileLanguage = (input: IProfileLanguage) => {
    if (!userId) return;
    const profileLanguageInput = {
      userId: userId,
      ...input,
    };
    const promise = executeAddProfileLanguage({
      variables: { language: profileLanguageInput },
    });
    toast.promise(promise, {
      loading: "Adding language",
      success: "Successfully added",
      error: (err) => err.message,
      position: "top-right",
    });
  };

  const updateProfileLanguage = (input: IProfileLanguage) => {
    if (!userId) return;
    const profileLanguageInput = {
      userId: userId,
      ...input,
    };
    const promise = executeUpdateProfileLanguage({
      variables: { language: profileLanguageInput },
    });
    toast.promise(promise, {
      loading: "Updating language",
      success: "Successfully updated",
      error: (err) => err.message,
      position: "top-right",
    });
  };

  const deleteProfileLanguages = (input: string[]) => {
    if (!userId) return;
    const profileLanguageInput = {
      userId: userId,
      name: input,
    };
    const promise = executeDeleteProfileLanguages({
      variables: { language: profileLanguageInput },
    });
    toast.promise(promise, {
      loading: "Deleting language",
      success: "Successfully deleted",
      error: (err) => err.message,
      position: "top-right",
    });
  };

  return {
    getAllLanguages,
    languages,
    isLanguagesLoading,
    addProfileLanguage,
    updateProfileLanguage,
    isAddingLoading,
    deleteProfileLanguages,
    isUpdatingLoading,
  };
}
