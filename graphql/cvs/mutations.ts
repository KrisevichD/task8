import { gql } from "@apollo/client";

export const DELETE_CV_MUTATION = gql`
  mutation DeleteCv($cv: DeleteCvInput!) {
    deleteCv(cv: $cv) {
      affected
    }
  }
`;
