import { useLazyQuery, useMutation } from "@apollo/client/react";

import { toast } from "sonner";

import { useMe } from "../auth/useMe";

import { useLanguage } from "@/context/language";
import {
  ADD_PROFILE_LANGUAGE,
  DELETE_PROFILE_LANGUAGE,
  GET_ALL_LANGUAGES,
  UPDATE_PROFILE_LANGUAGE,
} from "@/graphql/languages";
import { IProfileLanguage } from "@/types/languages";
import { getUserIdFromToken } from "@/utils/jwt";

export default function useLanguages(customUserId: string) {
  const { t } = useLanguage();
  const userId = customUserId || getUserIdFromToken() || "";
  const [getAllLanguages, { data: languages, loading: isLanguagesLoading }] =
    useLazyQuery(GET_ALL_LANGUAGES);
  const [executeAddProfileLanguage, { loading: isAddingLoading }] =
    useMutation(ADD_PROFILE_LANGUAGE);
  const [executeUpdateProfileLanguage] = useMutation(UPDATE_PROFILE_LANGUAGE);
  const [executeDeleteProfileLanguages, { loading: isUpdatingLoading }] =
    useMutation(DELETE_PROFILE_LANGUAGE);

  const { languages: profileLanguages } = useMe(userId);
  const currentLanguages = profileLanguages ?? [];

  const addProfileLanguage = (input: IProfileLanguage) => {
    if (!userId) return;
    const profileLanguageInput = {
      userId: userId,
      ...input,
    };
    const promise = executeAddProfileLanguage({
      variables: { language: profileLanguageInput },
      optimisticResponse: {
        addProfileLanguage: {
          __typename: "Profile",
          id: userId,
          languages: [
            ...currentLanguages,
            {
              __typename: "LanguageProficiency",
              name: input.name,
              proficiency: input.proficiency,
            },
          ],
        },
      },
    });
    toast.promise(promise, {
      loading: `${t("adding")} ${t("language").toLowerCase()}...`,
      success: `${t("language")} ${t("successfully")} ${t("added")}!`,
      error: (err) => `${t("errorMessage")} ${err.message}`,
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
      optimisticResponse: {
        updateProfileLanguage: {
          __typename: "Profile",
          id: userId,
          languages: currentLanguages.map((lang) =>
            lang.name === input.name
              ? {
                  __typename: "LanguageProficiency",
                  name: input.name,
                  proficiency: input.proficiency,
                }
              : lang,
          ),
        },
      },
    });
    toast.promise(promise, {
      loading: `${t("updating")} ${t("language").toLowerCase()}...`,
      success: `${t("language")} ${t("successfully")} ${t("updated")}!`,
      error: (err) => `${t("errorMessage")} ${err.message}`,
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
      optimisticResponse: {
        deleteProfileLanguage: {
          __typename: "Profile",
          id: userId,
          languages: currentLanguages.filter(
            (lang) => !input.some((e) => e === lang.name),
          ),
        },
      },
    });
    toast.promise(promise, {
      loading: `${t("deleting")} ${t("language").toLowerCase()}...`,
      success: `${t("language")} ${t("successfully")} ${t("deleted")}!`,
      error: (err) => `${t("errorMessage")} ${err.message}`,
      position: "top-right",
    });
  };

  const filteredLanguages = languages?.languages.filter(
    (lang) =>
      !profileLanguages?.some((profileLang) => profileLang.name === lang.name),
  );

  return {
    getAllLanguages,
    languages,
    filteredLanguages,
    isLanguagesLoading,
    addProfileLanguage,
    updateProfileLanguage,
    isAddingLoading,
    deleteProfileLanguages,
    isUpdatingLoading,
  };
}
