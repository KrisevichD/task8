import { gql, TypedDocumentNode } from "@apollo/client";

import {
  IAddCvProjectVariables,
  ICreateProjectVariables,
  ICvResponce,
  ICvVariables,
  IDeleteCvProjectVariables,
  IProjectData,
  IUpdateCvVariables,
} from "@/types/cv-constructor";
  
  export const GET_CV_QUERY: TypedDocumentNode<{cv:ICvResponce}, ICvVariables> = gql`
    query GetCv($cvId: ID!) {
      cv(cvId: $cvId) {
        id
        name
        description
        education
        projects {
          id
          name
          domain
          description
          environment
          responsibilities
        }
        skills {
          name
        }
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

export const UPDATE_CV: TypedDocumentNode<
  ICvResponce,
  IUpdateCvVariables
> = gql`
  mutation UpdateCv($cv: UpdateCvInput!) {
    updateCv(cv: $cv) {
      id
      name
      description
      education
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
      name
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
      }
    }
  }
`
