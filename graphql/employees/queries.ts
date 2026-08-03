import { TypedDocumentNode, gql } from "@apollo/client";

export type UserQueryResponse = {
  id: string;
  email: string;
  role?: string;
  department_name?: string;
  position_name?: string;
  profile: {
    first_name?: string;
    last_name?: string;
    avatar?: string;
  };
};

export interface IGetUsersData {
  users: UserQueryResponse[];
}

export const GET_EMPLOYEES: TypedDocumentNode<IGetUsersData> = gql`
  query GetUsers {
    users {
      id
      email
      role
      department_name
      position_name
      profile {
        first_name
        last_name
        avatar
      }
    }
  }
`;
