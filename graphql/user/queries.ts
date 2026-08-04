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
  created_at?: string;
  department_name?: string;
  position_name?: string;
  profile?: IUserProfile;
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
        created_at
        department_name
        position_name
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
      }
    }
  `;
