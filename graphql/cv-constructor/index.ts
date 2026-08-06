import { gql, TypedDocumentNode } from "@apollo/client";

import {
  IAddCvProjectVariables,
  IAddCvSkillVariables,
  ICreateProjectVariables,
  ICvResponce,
  ICvVariables,
  IDeleteCvProjectVariables,
  IDeleteCvSkillVariables,
  IDeleteProjectVariables,
  IProjectData,
  IProjectVariables,
  IUpdateCvVariables,
} from "@/types/cv-constructor";
import { IProfileSkillVariables } from "@/types/skills";

export const GET_CV: TypedDocumentNode<{ cv: ICvResponce }, ICvVariables> = gql`
  query GetCv($cvId: ID!) {
    cv(cvId: $cvId) {
      id
      name
      user {
        id
        position_name
        profile {
          id
          first_name
          last_name
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
      description
      education
      projects {
        id
        name
        project {
          id
        }
        domain
        description
        start_date
        end_date
        environment
        responsibilities
      }
      skills {
        categoryId
        mastery
        name
      }
    }
  }
`;

export const GET_ALL_PROJECTS: TypedDocumentNode<
  { projects: IProjectData[] },
  Record<string, never>
> = gql`
  query Projects {
    projects {
      id
      name
      domain
      start_date
      end_date
      description
      environment
    }
  }
`;

export const CREATE_PROJECT_MUTATION: TypedDocumentNode<
  { createProject: IProjectData },
  ICreateProjectVariables
> = gql`
  mutation CreateProject($project: CreateProjectInput!) {
    createProject(project: $project) {
      id
      name
      domain
      start_date
      end_date
      description
      environment
    }
  }
`;

export const DELETE_PROJECT: TypedDocumentNode<
  { affected: number },
  IDeleteProjectVariables
> = gql`
  mutation DeleteProject($project: DeleteProjectInput!) {
    deleteProject(project: $project) {
      affected
    }
  }
`;

export const UPDATE_CV: TypedDocumentNode<ICvResponce, IUpdateCvVariables> =
  gql`
    mutation UpdateCv($cv: UpdateCvInput!) {
      updateCv(cv: $cv) {
        id
        name
        description
        education
      }
    }
  `;

export const GET_PROJECT: TypedDocumentNode<IProjectData, IProjectVariables> =
  gql`
    query Project($projectId: ID!) {
      project(projectId: $projectId) {
        id
        name
        domain
        start_date
        end_date
        description
        environment
      }
    }
  `;

export const ADD_CV_PROJECT_MUTATION: TypedDocumentNode<
  ICvResponce,
  IAddCvProjectVariables
> = gql`
  mutation AddCvProject($project: AddCvProjectInput!) {
    addCvProject(project: $project) {
      id
      projects {
        id
        name
      }
    }
  }
`;

export const UPDATE_CV_PROJECT: TypedDocumentNode<
  ICvResponce,
  IAddCvProjectVariables
> = gql`
  mutation UpdateCvProject($project: UpdateCvProjectInput!) {
    updateCvProject(project: $project) {
      id
      projects {
        id
        name
        project {
          id
        }
        start_date
        end_date
        responsibilities
      }
    }
  }
`;

export const DELETE_CV_PROJECT: TypedDocumentNode<
  ICvResponce,
  IDeleteCvProjectVariables
> = gql`
  mutation RemoveCvProject($project: RemoveCvProjectInput!) {
    removeCvProject(project: $project) {
      id
      projects {
        id
        name
      }
    }
  }
`;

export const ADD_CV_SKILL: TypedDocumentNode<
  ICvResponce,
  IAddCvSkillVariables
> = gql`
  mutation AddCvSkill($skill: AddCvSkillInput!) {
    addCvSkill(skill: $skill) {
      id
      skills {
        name
        mastery
      }
    }
  }
`;

export const UPDATE_CV_SKILL: TypedDocumentNode<
  ICvResponce,
  IProfileSkillVariables
> = gql`
  mutation UpdateCvSkill($skill: UpdateCvSkillInput!) {
    updateCvSkill(skill: $skill) {
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
  IDeleteCvSkillVariables
> = gql`
  mutation DeleteCvSkill($skill: DeleteCvSkillInput!) {
    deleteCvSkill(skill: $skill) {
      id
      skills {
        name
        mastery
      }
    }
  }
`;

interface IPdfVariables {
  pdf: {
    html: string;
    margin: {
      top: string;
      bottom: string;
      left: string;
      right: string;
    }
  }
}

export const EXPORT_PDF: TypedDocumentNode<
  { exportPdf: string },
  IPdfVariables
> = gql`
  mutation ExportPdf($pdf: ExportPdfInput!) {
    exportPdf(pdf: $pdf) 
  }
`;
