import { TypedDocumentNode, gql } from "@apollo/client";

export interface IUserData {
  id: string;
  email: string;
  profile?: {
    first_name?: string;
    last_name?: string;
    avatar?: string;
  };
}

export interface IGetUserResponse {
  user: IUserData;
}

export interface IGetUserVariables {
  userId: string;
}

export const GET_USER: TypedDocumentNode<IGetUserResponse, IGetUserVariables> =
  gql`
    query GetUser($userId: ID!) {
      user(userId: $userId) {
        id
        email
        profile {
          first_name
          last_name
          avatar
        }
      }
    }
  `;
