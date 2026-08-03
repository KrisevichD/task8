import { useLazyQuery, useMutation, useQuery } from "@apollo/client/react";

import {
  ADD_PROFILE_SKILL,
  DELETE_PROFILE_SKILL,
  GET_ALL_SKILLS,
  GET_SKILLS_CATEGORIES,
} from "@/graphql/skills";
import { IProfileSkillInput } from "@/types/skills";
import { getUserIdFromToken } from "@/utils/jwt";

export default function useSkills() {
  const userId = getUserIdFromToken();
  const { data: skillCategories } = useQuery(GET_SKILLS_CATEGORIES);
  const [getAllSkills, { data: skills, loading: isSkillsLoading }] =
    useLazyQuery(GET_ALL_SKILLS);
  const [executeAddProfileSkill, { loading: isAddingLoading }] =
    useMutation(ADD_PROFILE_SKILL);
  const [executeDeleteProfileSkills, { loading: isUpdatingLoading }] =
    useMutation(DELETE_PROFILE_SKILL);

  const addProfileSkill = (input: IProfileSkillInput) => {
    if (!userId) return;
    const profileSkillInput = {
      userId: userId,
      ...input,
    };
    const responce = executeAddProfileSkill({
      variables: { skill: profileSkillInput },
    });
    return responce;
  };

  const deleteProfileSkills = (input: string[]) => {
    if (!userId) return;
    const profileSkillInput = {
      userId: userId,
      name: input,
    };
    executeDeleteProfileSkills({ variables: { skill: profileSkillInput } });
  };

  return {
    getAllSkills,
    skillCategories,
    skills,
    isSkillsLoading,
    addProfileSkill,
    isAddingLoading,
    deleteProfileSkills,
    isUpdatingLoading,
  };
}
