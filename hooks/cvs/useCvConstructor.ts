import { useLazyQuery, useMutation, useQuery } from "@apollo/client/react";

import { useParams } from "next/navigation";

import {
  ADD_CV_PROJECT_MUTATION,
  ADD_CV_SKILL,
  CREATE_PROJECT_MUTATION,
  DELETE_CV_PROJECT,
  DELETE_CV_SKILL,
  DELETE_PROJECT,
  GET_CV_QUERY,
  GET_PROJECT,
  UPDATE_CV,
} from "@/graphql/cv-constructor";
import { IAddCvProjectInput, IAddCvSkillInput, ICreateCvProjectForm, IProjectData, IUpdateCvInput } from "@/types/cv-constructor";
import { validateDateString } from "@/utils/helpers";

export default function useCvConstructor() {
  const cvId = useParams().id as string;
  const [createProject, { loading: isProjectLoading, error: projecterror }] = useMutation(CREATE_PROJECT_MUTATION);
  const [deleteProject, { }] = useMutation(DELETE_PROJECT);
  const [getProject, { }] = useLazyQuery(GET_PROJECT);
  const [executeAddCvProject, { loading: isCvProjectLoading, error: cvProjecterror }] = useMutation(ADD_CV_PROJECT_MUTATION);
  const [executeDeleteCvProject, { loading: isProjectDeleting, error: projectDeletingError }] = useMutation(DELETE_CV_PROJECT);
  const [executeUpdateCv, { loading: isCvUpdating, error: cvUpdatingError }] = useMutation(UPDATE_CV);
  const [executeAddCvSkill, { loading: isCvSkillLoading, error: cvSkillError }] = useMutation(ADD_CV_SKILL);
  const [executeDeleteCvSkill, { loading: isCvSkillDeleting, error: skillDeletingError }] = useMutation(DELETE_CV_SKILL);

  const addCvProject = async (input: ICreateCvProjectForm) => {
    const { responsibilities, ...createProjectData } = input;
    const response = await createProject({variables: { project: createProjectData }});
    if (!response.data) return;
    const project = response.data.createProject;

    const addProjectData = {
          cvId: cvId,
          projectId: project.id,
          start_date: validateDateString(project.start_date),
          end_date: validateDateString(project.end_date),
          roles: [],
          responsibilities: responsibilities.split("\n"),
        };
    executeAddCvProject({variables: { project: addProjectData }});
  }

  const deleteCvProject = async (input: { cvId: string; projectId: string }) => {
    console.log(input)
    // const project = await getProject({ variables: { projectId: input.projectId }});
    // if (!project.data) return;
    // console.log(project.data.id)
    await executeDeleteCvProject({variables: { project: input }});
    // deleteProject({ variables: { project: { projectId: input.projectId }}})
  }

  const addCvSkill = (input: IAddCvSkillInput) => {
    executeAddCvSkill({variables: {skill: input}})
  }

  const deleteCvSkill = (input: string[]) => {
    executeDeleteCvSkill({variables: {skill: {
        cvId: cvId,
        name: input,
    }}})
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

  return {
    cvData,
    isCvLoading,
    cvError,
    addCvProject,
    isCvProjectLoading,
    cvProjecterror,
    deleteCvProject,
    addCvSkill,
    deleteCvSkill,
    updateCv,
  };
}
