import { gql, TypedDocumentNode } from "@apollo/client";

export interface IPosition {
  id: string;
  name: string;
}

export interface IGetPositionsResponse {
  positions: IPosition[];
}

export const GET_POSITIONS: TypedDocumentNode<IGetPositionsResponse> = gql`
  query GetPositions {
    positions {
      id
      name
    }
  }
`;
