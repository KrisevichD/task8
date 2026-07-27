export interface ICVDetails {
  name: string;
  education: string;
  description: string;
}

export interface ICVProject {
  id: number;
  project: string;
  domain: string;
  startDate: Date;
  endDate: Date | "Till now";
  description: string;
  enviroment: string[];
  responsibilities: string;
}

export interface ISkillCategory {
    id: number;
    name: string;
    order: number;
}

export interface ISkill {
    id: number;
    name: string;
    category: ISkillCategory;
}

export interface ISkillContext extends ISkill {
    mastery: TSkillMastery;
}

export interface ISkillData {
    skills: ISkill[];
}

export type TSkillMastery = "Beginner" | "Novice" | "Intermediate" | "Proficient" | "Expert";

export interface ISkillForm {
    name: string;  
    mastery: TSkillMastery;
}

export interface ISkillCategoryData {
    skillCategories: ISkillCategory[];
}

export interface ICVData {
  details: ICVDetails;
  projects: ICVProject[];
  skills: ISkillContext[];
}
