import { ILanguage, IProfileLanguage } from "./languages";
import { ISkill } from "./skills";

export interface ICvProject {
  id: string;
  name: string;
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
  education: string;
  description: string;
  projects: ICvProject[];
  skills: ISkill[];
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
    }
}

export interface IDeleteCvSkillVariables {
    skill: {
        cvId: string;
        name: string[];
    }
}
