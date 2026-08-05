import { useMutation, useQuery } from "@apollo/client/react";

import { useParams } from "next/navigation";

import {
  ADD_CV_PROJECT_MUTATION,
  ADD_CV_SKILL,
  CREATE_PROJECT_MUTATION,
  DELETE_CV_PROJECT,
  DELETE_CV_SKILL,
  DELETE_PROJECT,
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
import { IProfileSkill, IProfileSkillInput } from "@/types/skills";
import { toast } from "sonner";
import { UPDATE_CV_SKILL } from "@/graphql/skills";

export default function useCvConstructor() {
  const cvId = useParams().id as string;
  const [createProject] = useMutation(CREATE_PROJECT_MUTATION);
  const [deleteProject, {}] = useMutation(DELETE_PROJECT, {
    refetchQueries: ["GetCv"],
  });
  const [
    executeAddCvProject,
    { loading: isCvProjectLoading, error: cvProjecterror },
  ] = useMutation(ADD_CV_PROJECT_MUTATION);
  const [executeUpdateCvProject] = useMutation(UPDATE_CV_PROJECT);
  const [executeDeleteCvProject] = useMutation(DELETE_CV_PROJECT);
  const [executeUpdateCv] = useMutation(UPDATE_CV);
  const [executeAddCvSkill] = useMutation(ADD_CV_SKILL);
  const [executeUpdateCvSkill, { loading: isCvUpdatingLoading }] =
    useMutation(UPDATE_CV_SKILL);
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
    const promise = executeAddCvProject({ variables: { project: addProjectData } });
    toast.promise(promise, {
      loading: "Adding project",
      success: "Successfully added",
      error: (err) => err.message,
      position: "top-right",
    })
  };

  const updateCvProject = async (id: string, input: ICreateCvProjectForm) => {
    const { responsibilities, start_date, end_date } = input;
    console.log(start_date, end_date, responsibilities);
    const promise = executeUpdateCvProject({
      variables: {
        project: {
          cvId: cvId,
          projectId: id,
          start_date: start_date,
          end_date: end_date,
          roles: [],
          responsibilities:
            responsibilities.trim().length > 0
              ? responsibilities.trim().split("\n").filter(e => e.trim().length !== 0)
              : [],
        },
      },
    });
    toast.promise(promise, {
      loading: "Updating project",
      success: "Successfully updated",
      error: (err) => err.message,
      position: "top-right",
    })
  };

  const deleteCvProject = async (input: {
    cvId: string;
    project: ICvProject;
  }) => {
    const promise = deleteProject({
      variables: { project: { projectId: input.project.project.id } },
    });
    toast.promise(promise, {
      loading: "Deleting project",
      success: "Successfully deleted",
      error: (err) => err.message,
      position: "top-right",
    })
  };

  const addCvSkill = (input: IProfileSkill) => {
    const data = {
      cvId: cvId,
      ...input,
    }
    const promise = executeAddCvSkill({ variables: { skill: data } });
    toast.promise(promise, {
      loading: "Adding skill",
      success: "Successfully added",
      error: (err) => err.message,
      position: "top-right",
    })
  };
  
    

  const deleteCvSkill = (input: string[]) => {
    const promise = executeDeleteCvSkill({
      variables: {
        skill: {
          cvId: cvId,
          name: input,
        },
      },
    });
    
    toast.promise(promise, {
      loading: "Deleting skill",
      success: "Successfully deleted",
      error: (err) => err.message,
      position: "top-right",
    })
  };

  const updateCv = (input: IUpdateCvInput) => {
    const promise = executeUpdateCv({ variables: { cv: input } });
    toast.promise(promise, {
      loading: "Updating CV",
      success: "Successfully updated",
      error: (err) => err.message,
      position: "top-right",
    })
    return promise;
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
