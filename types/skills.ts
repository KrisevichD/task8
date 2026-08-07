import { IUserProfile } from "@/graphql/user/queries";

export type TSkillMastery =
  "Novice" | "Advanced" | "Competent" | "Proficient" | "Expert";

export interface IProfileSkill {
  name: string;
  categoryId: string;
  mastery: TSkillMastery;
  __typename?: "SkillMastery";
}

export interface ISkill {
  id: string;
  name: string;
  category: {
    id: string;
  };
  category_name: string;
  category_parent_name: string;
}

export interface ISkillCategory {
  id: string;
  name: string;
  order: number;
  parent: ISkillCategory | null;
}

export interface IGetAllSkillsResponce {
  skills: ISkill[];
}

export interface IProfileResponce {
  profile: IUserProfile;
}

export interface IProfileSkillVariables {
  skill: IProfileSkill;
}

export interface IDeleteProfileSkillVariables {
  skill: {
    userId: string;
    name: string[];
  };
}

export interface IGetSkillsCategoriesResponce {
  skillCategories: ISkillCategory[];
}
