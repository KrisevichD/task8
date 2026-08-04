import { gql, TypedDocumentNode } from "@apollo/client";

export interface IDepartment {
  id: string;
  name: string;
}

export interface IGetDepartmentsResponse {
  departments: IDepartment[];
}

export const GET_DEPARTMENTS: TypedDocumentNode<IGetDepartmentsResponse> = gql`
  query GetDepartments {
    departments {
      id
      name
    }
  }
`;
