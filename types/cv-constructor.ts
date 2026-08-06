import { IProfileLanguage } from "./languages";
import { IProfileSkill } from "./skills";

import { IUserData } from "@/graphql/user/queries";

export interface ICvProject {
  id: string;
  name: string;
  project: IProjectData;
  description: string;
  domain: string;
  start_date: string;
  end_date: string;
  environment: string[];
  responsibilities: string[];
}

export interface ICvResponce {
  id: string;
  name: string;
  user: IUserData;
  education: string;
  description: string;
  projects: ICvProject[];
  skills: IProfileSkill[];
  languages: IProfileLanguage[];
}

export interface ICvVariables {
  cvId: string;
}

export interface ICvDetailsForm {
  name: string;
  education: string;
  description: string;
}

export interface ICreateProjectInput {
  name: string;
  domain: string;
  start_date: string;
  end_date: string;
  description: string;
  environment: string[];
}

export interface ICreateProjectVariables {
  project: ICreateProjectInput;
}

export interface IProjectData {
  id: string;
  name: string;
  domain: string;
  start_date: string;
  end_date: string;
  description: string;
  environment: string[];
}

export interface IAddCvProjectInput {
  cvId: string;
  projectId: string;
  start_date: string;
  end_date: string;
  roles: string[];
  responsibilities: string[];
}

export interface ICreateCvProjectForm extends ICreateProjectInput {
  responsibilities: string;
}

export interface IUpdateCvInput {
  cvId: string;
  name: string;
  education: string;
  description: string;
}

export interface IUpdateCvVariables {
  cv: IUpdateCvInput;
}

export interface IAddCvProjectVariables {
  project: IAddCvProjectInput;
}

export interface IDeleteCvProjectVariables {
  project: {
    cvId: string;
    projectId: string;
  };
}

export interface IAddCvSkillInput extends IProfileSkill {
  cvId: string;
}

export interface IAddCvSkillVariables {
  skill: IAddCvSkillInput;
}

export interface IDeleteCvSkillVariables {
  skill: {
    cvId: string;
    name: string[];
  };
}

export interface IProjectVariables {
  projectId: string;
}

export interface IDeleteProjectVariables {
  project: IProjectVariables;
}
