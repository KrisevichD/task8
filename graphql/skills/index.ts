import { gql, TypedDocumentNode } from "@apollo/client";

import { IUserProfile } from "../user/queries";

import {
  IDeleteProfileSkillVariables,
  IGetAllSkillsResponce,
  IGetSkillsCategoriesResponce,
  IProfileSkillVariables,
} from "@/types/skills";

export const GET_ALL_SKILLS: TypedDocumentNode<
  IGetAllSkillsResponce,
  Record<string, never>
> = gql`
  query GetAllSkills {
    skills {
      id
      name
      category {
        id
      }
      category_name
      category_parent_name
    }
  }
`;

export const GET_SKILLS_CATEGORIES: TypedDocumentNode<
  IGetSkillsCategoriesResponce,
  Record<string, never>
> = gql`
  query SkillCategories {
    skillCategories {
      id
      name
      order
      parent {
        id
        name
      }
    }
  }
`;

export const ADD_PROFILE_SKILL: TypedDocumentNode<
  { addProfileSkill: IUserProfile },
  IProfileSkillVariables
> = gql`
  mutation AddProfileSkill($skill: AddProfileSkillInput!) {
    addProfileSkill(skill: $skill) {
      id
      skills {
        name
        categoryId
        mastery
      }
    }
  }
`;

export const UPDATE_PROFILE_SKILL: TypedDocumentNode<
  { updateProfileSkill: IUserProfile },
  IProfileSkillVariables
> = gql`
  mutation UpdateProfileSkill($skill: UpdateProfileSkillInput!) {
    updateProfileSkill(skill: $skill) {
      id
      skills {
        name
        categoryId
        mastery
      }
    }
  }
`;

export const DELETE_PROFILE_SKILL: TypedDocumentNode<
  { deleteProfileSkill: IUserProfile },
  IDeleteProfileSkillVariables
> = gql`
  mutation DeleteProfileSkill($skill: DeleteProfileSkillInput!) {
    deleteProfileSkill(skill: $skill) {
      id
      skills {
        name
        categoryId
        mastery
      }
    }
  }
`;
