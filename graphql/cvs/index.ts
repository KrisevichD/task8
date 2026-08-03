import { gql } from "@apollo/client";

export const CREATE_CV_MUTATION = gql`
  mutation CreateCV($cv: CreateCvInput!) {
    createCv(cv: $cv) {
      id
      name
      education
      description
    }
  }
`;
