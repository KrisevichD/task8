import { TypedDocumentNode, gql } from "@apollo/client";

import { IProfileLanguage } from "@/types/languages";
import { IProfileSkill } from "@/types/skills";

export interface IUserProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  avatar?: string;
  skills?: IProfileSkill[];
  languages?: IProfileLanguage[];
}

export interface IUserData {
  id: string;
  email: string;
  profile?: IUserProfile;
  position_name?: string;
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
          id
          first_name
          last_name
          avatar
          skills {
            name
            categoryId
            mastery
          }
          languages {
            name
            proficiency
          }
        }
        position_name
      }
    }
  `;
