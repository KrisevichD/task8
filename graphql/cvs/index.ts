import { gql, TypedDocumentNode } from "@apollo/client";

import { ICreateCvData, ICreateCvVariables } from "@/types/cvs";

export const CREATE_CV_MUTATION: TypedDocumentNode<
  ICreateCvData,
  ICreateCvVariables
> = gql`
  mutation CreateCV($cv: CreateCvInput!) {
    createCv(cv: $cv) {
      id
      name
      education
      description
    }
  }
`;
