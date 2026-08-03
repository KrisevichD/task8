export interface ICreateCvData {
  createCv: {
    id: string;
    name: string;
    education: string;
    description: string;
  };
}

export interface ICreateCvInput {
  userId: string;
  name: string;
  education: string;
  description: string;
}

export interface ICreateCvVariables {
  cv: ICreateCvInput;
}
