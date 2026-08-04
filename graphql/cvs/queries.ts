import { TypedDocumentNode, gql } from "@apollo/client";

export interface ICv {
  id: string;
  name: string;
  education?: string;
  description?: string;
  user?: {
    id: string;
    email: string;
  };
}

export interface IGetCvsResponse {
  cvs: ICv[];
}

export const GET_CVS: TypedDocumentNode<IGetCvsResponse> = gql`
  query GetCvs {
    cvs {
      id
      name
      education
      description
      user {
        id
        email
      }
    }
  }
`;
