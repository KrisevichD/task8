import { useMutation, useQuery } from "@apollo/client/react";

import { useParams } from "next/navigation";

import {
  ADD_CV_PROJECT_MUTATION,
  CREATE_PROJECT_MUTATION,
  DELETE_CV_PROJECT,
  GET_CV_QUERY,
  UPDATE_CV,
} from "@/graphql/cv-constructor";
import { IAddCvProjectInput, IUpdateCvInput } from "@/types/cv-constructor";

export default function useCvConstructor() {
  const cvId = useParams().id as string;
  const [createProject, { loading: isProjectLoading, error: projecterror }] = useMutation(CREATE_PROJECT_MUTATION);
  const [executeAddCvProject, { loading: isCvProjectLoading, error: cvProjecterror }] = useMutation(ADD_CV_PROJECT_MUTATION);
  const [executeDeleteCvProject, { loading: isProjectDeleting, error: projectDeletingError }] = useMutation(DELETE_CV_PROJECT);
  const [executeUpdateCv, { loading: isCvUpdating, error: cvUpdatingError }] = useMutation(UPDATE_CV);

  const addCvProject = (input: IAddCvProjectInput) => {
    executeAddCvProject({variables: {project: input}})
  }

  const deleteCvProject = (input: { cvId: string; projectId: string }) => {
    executeDeleteCvProject({variables: {project: input}})
  }

  const updateCv = (input: IUpdateCvInput) => {
    return executeUpdateCv({variables: {cv: input}})
  }

  const {
    data: cvData,
    loading: isCvLoading,
    error: cvError,
  } = useQuery(GET_CV_QUERY, {
    variables: { cvId: cvId },
    skip: !cvId
  });

  console.log(cvData)

  return {
    cvData,
    isCvLoading,
    cvError,
    createProject,
    isProjectLoading,
    projecterror,
    addCvProject,
    isCvProjectLoading,
    cvProjecterror,
    deleteCvProject,
    updateCv,
  };
}
