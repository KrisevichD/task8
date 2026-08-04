import { useLazyQuery, useMutation, useQuery } from "@apollo/client/react";

import {
  ADD_PROFILE_SKILL,
  DELETE_PROFILE_SKILL,
  GET_ALL_SKILLS,
  GET_SKILLS_CATEGORIES,
} from "@/graphql/skills";
import { GET_USER } from "@/graphql/user/queries";
import { IProfileSkillInput } from "@/types/skills";
import { getUserIdFromToken } from "@/utils/jwt";

export default function useSkills(customUserId?: string) {
  const userId = customUserId || getUserIdFromToken();

  const { data: skillCategoriesData, loading: isCategoriesLoading } = useQuery(
    GET_SKILLS_CATEGORIES,
  );
  const [getAllSkills, { data: skills, loading: isSkillsLoading }] =
    useLazyQuery(GET_ALL_SKILLS);
  const [executeAddProfileSkill, { loading: isAddingLoading }] =
    useMutation(ADD_PROFILE_SKILL);
  const [executeDeleteProfileSkills, { loading: isUpdatingLoading }] =
    useMutation(DELETE_PROFILE_SKILL);

  const skillCategories = skillCategoriesData?.skillCategories;

  const addProfileSkill = (input: Omit<IProfileSkillInput, "userId">) => {
    if (!userId) return;
    const profileSkillInput = {
      userId: userId,
      ...input,
    };
    return executeAddProfileSkill({
      variables: { skill: profileSkillInput },
      refetchQueries: [{ query: GET_USER, variables: { userId } }],
    });
  };

  const deleteProfileSkills = (input: string[]) => {
    if (!userId) return;
    const profileSkillInput = {
      userId: userId,
      name: input,
    };
    return executeDeleteProfileSkills({
      variables: { skill: profileSkillInput },
      refetchQueries: [{ query: GET_USER, variables: { userId } }],
    });
  };

  return {
    getAllSkills,
    skillCategories,
    isCategoriesLoading,
    skills,
    isSkillsLoading,
    addProfileSkill,
    isAddingLoading,
    deleteProfileSkills,
    isUpdatingLoading,
  };
}
