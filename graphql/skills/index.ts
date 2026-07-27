import { ISkillCategory, ISkillCategoryData, ISkillData } from "@/types/cv";
import { gql, TypedDocumentNode } from "@apollo/client";

export const GET_ALL_SKILLS: TypedDocumentNode<ISkillData, Record<string, never>> = gql`
  query GetAllSkills {
    skills {
      id
      name
      category {
        id
        name
      }
    }
  }
`;

export const GET_SKILLS_CATEGORIES: TypedDocumentNode<ISkillCategoryData, Record<string, never>> = gql`
  query GetSkillCategories {
    skillCategories {
      id
      name
      order
    }
  }
`;

