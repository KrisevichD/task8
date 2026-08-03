import { gql, TypedDocumentNode } from "@apollo/client";

import {
  IDeleteProfileSkillVariables,
  IGetAllSkillsResponce,
  IProfileResponce,
  IProfileSkillVariables,
} from "@/types/skills";
import { ICvResponce } from "@/types/cv-constructor";

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

export const ADD_PROFILE_SKILL: TypedDocumentNode<
  IProfileResponce,
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
export const DELETE_PROFILE_SKILL: TypedDocumentNode<
  IProfileResponce,
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

export const ADD_CV_SKILL: TypedDocumentNode<
  ICvResponce,
  IProfileSkillVariables
> = gql`
  mutation AddCvSkill($skill: AddCvSkillInput!) {
    addCvSkill(skill: $skill) {
      id
      skills {
        name
        categoryId
        mastery
      }
    }
  }
`;

export const DELETE_CV_SKILL: TypedDocumentNode<
  ICvResponce,
  IDeleteProfileSkillVariables
> = gql`
  mutation DeleteCvSkill($skill: DeleteCvSkillInput!) {
    deleteCvSkill(skill: $skill) {
      id
      skills {
        name
        categoryId
        mastery
      }
    }
  }
`;
