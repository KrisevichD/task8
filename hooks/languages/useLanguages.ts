import { useLazyQuery, useMutation } from "@apollo/client/react";

import {
  ADD_PROFILE_LANGUAGE,
  DELETE_PROFILE_LANGUAGE,
  GET_ALL_LANGUAGES,
} from "@/graphql/languages";
import { IProfileLanguage } from "@/types/languages";
import { getUserIdFromToken } from "@/utils/jwt";

export default function useLanguages() {
  const userId = getUserIdFromToken();
  const [getAllLanguages, { data: languages, loading: isLanguagesLoading }] =
    useLazyQuery(GET_ALL_LANGUAGES);
  const [executeAddProfileLanguage, { loading: isAddingLoading }] =
    useMutation(ADD_PROFILE_LANGUAGE);
  const [executeDeleteProfileLanguages, { loading: isUpdatingLoading }] =
    useMutation(DELETE_PROFILE_LANGUAGE);

  const addProfileLanguage = (input: IProfileLanguage) => {
    if (!userId) return;
    const profileLanguageInput = {
      userId: userId,
      ...input,
    };
    const responce = executeAddProfileLanguage({
      variables: { language: profileLanguageInput },
    });
    return responce;
  };

  const deleteProfileLanguages = (input: string[]) => {
    if (!userId) return;
    const profileLanguageInput = {
      userId: userId,
      name: input,
    };
    executeDeleteProfileLanguages({
      variables: { language: profileLanguageInput },
    });
  };

  return {
    getAllLanguages,
    languages,
    isLanguagesLoading,
    addProfileLanguage,
    isAddingLoading,
    deleteProfileLanguages,
    isUpdatingLoading,
  };
}
