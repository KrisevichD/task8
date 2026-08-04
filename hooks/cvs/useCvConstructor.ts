import { useMutation, useQuery } from "@apollo/client/react";

import { useParams } from "next/navigation";

import {
  ADD_CV_PROJECT_MUTATION,
  ADD_CV_SKILL,
  CREATE_PROJECT_MUTATION,
  DELETE_CV_PROJECT,
  DELETE_CV_SKILL,
  GET_CV,
  UPDATE_CV,
  UPDATE_CV_PROJECT,
} from "@/graphql/cv-constructor";
import {
  IAddCvSkillInput,
  ICreateCvProjectForm,
  ICvProject,
  IUpdateCvInput,
} from "@/types/cv-constructor";
import { validateDateString } from "@/utils/helpers";

export default function useCvConstructor() {
  const cvId = useParams().id as string;
  const [createProject] = useMutation(CREATE_PROJECT_MUTATION);
  // const [deleteProject, {}] = useMutation(DELETE_PROJECT, {
  //   refetchQueries: ["GetCv"],
  // });
  // const [getProject, {}] = useLazyQuery(GET_PROJECT);
  // const [getAllProjects, { data: projects }] = useLazyQuery(GET_ALL_PROJECTS);
  const [
    executeAddCvProject,
    { loading: isCvProjectLoading, error: cvProjecterror },
  ] = useMutation(ADD_CV_PROJECT_MUTATION);
  const [executeUpdateCvProject] = useMutation(UPDATE_CV_PROJECT);
  const [executeDeleteCvProject] = useMutation(DELETE_CV_PROJECT);
  const [executeUpdateCv] = useMutation(UPDATE_CV);
  const [executeAddCvSkill] = useMutation(ADD_CV_SKILL);
  const [executeDeleteCvSkill] = useMutation(DELETE_CV_SKILL);
  const {
    data: cvData,
    loading: isCvLoading,
    error: cvError,
  } = useQuery(GET_CV, {
    variables: { cvId: cvId },
    skip: !cvId,
  });

  const addCvProject = async (input: ICreateCvProjectForm) => {
    const { responsibilities, ...createProjectData } = input;
    const response = await createProject({
      variables: { project: createProjectData },
    });
    if (!response.data) return;
    const project = response.data.createProject;

    const addProjectData = {
      cvId: cvId,
      projectId: project.id,
      start_date: validateDateString(project.start_date),
      end_date: validateDateString(project.end_date),
      roles: [],
      responsibilities:
        responsibilities.trim().length > 0
          ? responsibilities.trim().split("\n")
          : [],
    };
    executeAddCvProject({ variables: { project: addProjectData } });
  };

  const updateCvProject = async (id: string, input: ICreateCvProjectForm) => {
    const { responsibilities, start_date, end_date } = input;
    console.log(start_date, end_date, responsibilities);
    executeUpdateCvProject({
      variables: {
        project: {
          cvId: cvId,
          projectId: id,
          start_date: start_date,
          end_date: end_date,
          roles: [],
          responsibilities:
            responsibilities.trim().length > 0
              ? responsibilities.trim().split("\n")
              : [],
        },
      },
    });
  };

  const deleteCvProject = async (input: {
    cvId: string;
    project: ICvProject;
  }) => {
    // console.log(input)
    // const response = await getAllProjects();
    // console.log(response)
    // const idToDelete = response.data?.projects.find(project => {
    //   const matchesName = project.name === input.project.name;
    //   const matchesDomain = project.domain === input.project.domain;
    //   const matchesDescription = project.description === input.project.description;
    //   const matchesStartDate = project.start_date === input.project.start_date;
    //   const matchesEndDate = project.end_date === input.project.end_date;

    //   return matchesName && matchesDomain && matchesDescription && matchesStartDate && matchesEndDate;
    // })?.id;
    // console.log("!",idToDelete)
    // if(!idToDelete) return;
    // deleteProject({ variables: { project: { projectId: idToDelete }}});
    executeDeleteCvProject({
      variables: { project: { cvId: input.cvId, projectId: input.project.id } },
    });
  };

  const addCvSkill = (input: IAddCvSkillInput) => {
    executeAddCvSkill({ variables: { skill: input } });
  };

  const deleteCvSkill = (input: string[]) => {
    executeDeleteCvSkill({
      variables: {
        skill: {
          cvId: cvId,
          name: input,
        },
      },
    });
  };

  const updateCv = (input: IUpdateCvInput) => {
    return executeUpdateCv({ variables: { cv: input } });
  };

  return {
    cvData,
    isCvLoading,
    cvError,
    addCvProject,
    updateCvProject,
    isCvProjectLoading,
    cvProjecterror,
    deleteCvProject,
    addCvSkill,
    deleteCvSkill,
    updateCv,
  };
}
