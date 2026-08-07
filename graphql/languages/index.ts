import { gql, TypedDocumentNode } from "@apollo/client";

import { IUserProfile } from "../user/queries";

import {
  IAddProfileLanguageVariables,
  IDeleteProfileLanguageVariables,
  ILanguage,
} from "@/types/languages";

export const GET_ALL_LANGUAGES: TypedDocumentNode<
  { languages: ILanguage[] },
  Record<string, never>
> = gql`
  query {
    languages {
      id
      name
      native_name
    }
  }
`;

export const ADD_PROFILE_LANGUAGE: TypedDocumentNode<
  { addProfileLanguage: IUserProfile },
  IAddProfileLanguageVariables
> = gql`
  mutation AddProfileLanguage($language: AddProfileLanguageInput!) {
    addProfileLanguage(language: $language) {
      id
      languages {
        name
        proficiency
      }
    }
  }
`;

export const UPDATE_PROFILE_LANGUAGE: TypedDocumentNode<
  { updateProfileLanguage: IUserProfile },
  IAddProfileLanguageVariables
> = gql`
  mutation UpdateProfileLanguage($language: UpdateProfileLanguageInput!) {
    updateProfileLanguage(language: $language) {
      id
      languages {
        name
        proficiency
      }
    }
  }
`;

export const DELETE_PROFILE_LANGUAGE: TypedDocumentNode<
  { deleteProfileLanguage: IUserProfile },
  IDeleteProfileLanguageVariables
> = gql`
  mutation DeleteProfileLanguage($language: DeleteProfileLanguageInput!) {
    deleteProfileLanguage(language: $language) {
      id
      languages {
        name
        proficiency
      }
    }
  }
`;
