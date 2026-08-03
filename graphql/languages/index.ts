import { gql, TypedDocumentNode } from "@apollo/client";

import {
  IAddProfileLanguageVariables,
  IDeleteProfileLanguageVariables,
  ILanguage,
} from "@/types/languages";
import { IProfileResponce } from "@/types/skills";

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
  IProfileResponce,
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
export const DELETE_PROFILE_LANGUAGE: TypedDocumentNode<
  IProfileResponce,
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
