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

export interface ICVSkill {
  name: string;
  progress: number;
}

export interface ICVSkills {}

export interface ICVData {
  details: ICVDetails;
  projects: ICVProject[];
}
