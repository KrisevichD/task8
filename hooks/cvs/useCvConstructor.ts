import { useMutation, useQuery } from "@apollo/client/react";

import { toast } from "sonner";

import {
  ADD_CV_PROJECT_MUTATION,
  ADD_CV_SKILL,
  CREATE_PROJECT_MUTATION,
  DELETE_CV_SKILL,
  DELETE_PROJECT,
  GET_CV,
  UPDATE_CV,
  UPDATE_CV_PROJECT,
  UPDATE_CV_SKILL,
} from "@/graphql/cv-constructor";
import {
  IAddCvProjectInput,
  ICreateCvProjectForm,
  ICvProject,
  IUpdateCvInput,
} from "@/types/cv-constructor";
import { IProfileSkill } from "@/types/skills";
import { validateDateString } from "@/utils/helpers";

export default function useCvConstructor(cvId: string) {
  const [createProject] = useMutation(CREATE_PROJECT_MUTATION);
  const [deleteProject] = useMutation(DELETE_PROJECT, {
    refetchQueries: ["GetCv"],
  });
  const [
    executeAddCvProject,
    { loading: isCvProjectLoading, error: cvProjectError },
  ] = useMutation(ADD_CV_PROJECT_MUTATION);

  const [executeUpdateCvProject] = useMutation(UPDATE_CV_PROJECT);
  const [executeUpdateCv] = useMutation(UPDATE_CV);
  const [executeAddCvSkill] = useMutation(ADD_CV_SKILL);
  const [executeUpdateCvSkill] = useMutation(UPDATE_CV_SKILL);
  const [executeDeleteCvSkill] = useMutation(DELETE_CV_SKILL);
  const {
    data,
    loading: isCvLoading,
    error: cvError,
  } = useQuery(GET_CV, {
    variables: { cvId: cvId },
    skip: !cvId,
  });

  const cvData = data?.cv;
  const currentSkills: IProfileSkill[] =
    cvData?.skills?.map((skill) => ({
      __typename: "SkillMastery",
      name: skill.name,
      categoryId: skill.categoryId,
      mastery: skill.mastery,
    })) || [];

  const addCvProject = async (input: ICreateCvProjectForm) => {
    const { responsibilities, ...createProjectData } = input;
    const response = await createProject({
      variables: { project: createProjectData },
    });
    if (!response.data) return;
    const project = response.data.createProject;

    const addProjectData: IAddCvProjectInput = {
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
    const promise = executeAddCvProject({
      variables: { project: addProjectData },
    });
    toast.promise(promise, {
      loading: "Adding project",
      success: "Successfully added",
      error: (err) => err.message,
      position: "top-right",
    });
  };

  const updateCvProject = async (id: string, input: ICreateCvProjectForm) => {
    const { responsibilities, start_date, end_date } = input;
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
              ? responsibilities
                  .trim()
                  .split("\n")
                  .filter((e) => e.trim().length !== 0)
              : [],
        },
      },
    });
    toast.promise(promise, {
      loading: "Updating project",
      success: "Successfully updated",
      error: (err) => err.message,
      position: "top-right",
    });
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
    });
  };

  const addCvSkill = (input: IProfileSkill) => {
    if (!cvData) return;
    const data = {
      cvId: cvId,
      ...input,
    };
    const promise = executeAddCvSkill({
      variables: { skill: data },
      optimisticResponse: {
        addCvSkill: {
          ...cvData,
          __typename: "Cv",
          skills: [
            ...currentSkills,
            {
              __typename: "SkillMastery",
              name: input.name,
              categoryId: input.categoryId,
              mastery: input.mastery,
            },
          ],
        },
      },
    });
    toast.promise(promise, {
      loading: "Adding skill",
      success: "Successfully added",
      error: (err) => err.message,
      position: "top-right",
    });
  };

  const updateCvSkill = (input: IProfileSkill) => {
    if (!cvData) return;
    const data = {
      cvId: cvId,
      ...input,
    };
    const promise = executeUpdateCvSkill({
      variables: { skill: data },
      optimisticResponse: {
        updateCvSkill: {
          ...cvData,
          __typename: "Cv",
          skills: currentSkills.map((skill) =>
            skill.name === input.name
              ? {
                  __typename: "SkillMastery",
                  name: input.name,
                  categoryId: input.categoryId,
                  mastery: input.mastery,
                }
              : skill,
          ),
        },
      },
    });
    toast.promise(promise, {
      loading: "Updating skill",
      success: "Successfully updated",
      error: (err) => err.message,
      position: "top-right",
    });
  };

  const deleteCvSkill = (input: string[]) => {
    if (!cvData) return;
    const promise = executeDeleteCvSkill({
      variables: {
        skill: {
          cvId: cvId,
          name: input,
        },
      },
      optimisticResponse: {
        deleteCvSkill: {
          ...cvData,
          __typename: "Cv",
          skills: currentSkills.filter(
            (skill) => !input.some((e) => e === skill.name),
          ),
        },
      },
    });

    toast.promise(promise, {
      loading: "Deleting skill",
      success: "Successfully deleted",
      error: (err) => err.message,
      position: "top-right",
    });
  };

  const updateCv = (input: IUpdateCvInput) => {
    const promise = executeUpdateCv({ variables: { cv: input } });
    toast.promise(promise, {
      loading: "Updating CV",
      success: "Successfully updated",
      error: (err) => err.message,
      position: "top-right",
    });
  };

  return {
    cvData,
    isCvLoading,
    cvError,
    addCvProject,
    updateCvProject,
    isCvProjectLoading,
    cvProjectError,
    deleteCvProject,
    addCvSkill,
    updateCvSkill,
    deleteCvSkill,
    updateCv,
  };
}
