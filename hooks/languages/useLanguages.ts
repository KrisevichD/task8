import { useLazyQuery, useMutation } from "@apollo/client/react";

import {
  ADD_PROFILE_LANGUAGE,
  DELETE_PROFILE_LANGUAGE,
  GET_ALL_LANGUAGES,
} from "@/graphql/languages";
import { GET_USER } from "@/graphql/user/queries";
import { IProfileLanguage } from "@/types/languages";
import { getUserIdFromToken } from "@/utils/jwt";

export default function useLanguages(customUserId?: string) {
  const userId = customUserId || getUserIdFromToken();

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
    return executeAddProfileLanguage({
      variables: { language: profileLanguageInput },
      refetchQueries: [{ query: GET_USER, variables: { userId } }],
    });
  };

  const deleteProfileLanguages = (input: string[]) => {
    if (!userId) return;
    const profileLanguageInput = {
      userId: userId,
      name: input,
    };
    return executeDeleteProfileLanguages({
      variables: { language: profileLanguageInput },
      refetchQueries: [{ query: GET_USER, variables: { userId } }],
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
