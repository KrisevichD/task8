import { OperationVariables } from "@apollo/client";

export type TLanguageProficiency =
  "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "Native";

export interface ILanguage {
  id: string;
  name: string;
  native_name: string;
}

export interface IProfileLanguage {
  name: string;
  proficiency: TLanguageProficiency;
  __typename?: "LanguageProficiency";
}

export interface IAddProfileLanguageVariables extends OperationVariables {
  language: {
    userId: string;
    name: string;
    proficiency: TLanguageProficiency;
  };
}

export interface IDeleteProfileLanguageVariables {
  language: {
    userId: string;
    name: string[];
  };
}
