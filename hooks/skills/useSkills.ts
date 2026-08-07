import { useLazyQuery, useMutation, useQuery } from "@apollo/client/react";

import { toast } from "sonner";

import { useMe } from "../auth/useMe";

import {
  ADD_PROFILE_SKILL,
  DELETE_PROFILE_SKILL,
  GET_ALL_SKILLS,
  GET_SKILLS_CATEGORIES,
  UPDATE_PROFILE_SKILL,
} from "@/graphql/skills";
import { IProfileSkill } from "@/types/skills";
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
  const [executeUpdateProfileSkill, { loading: isUpdatingLoading }] =
    useMutation(UPDATE_PROFILE_SKILL);
  const [executeDeleteProfileSkills, { loading: isDeletingLoading }] =
    useMutation(DELETE_PROFILE_SKILL);

  const skillCategories = skillCategoriesData?.skillCategories;

  const { skills: profileSkills } = useMe(userId);
  const currentSkills = profileSkills ?? [];

  const addProfileSkill = (input: IProfileSkill) => {
    if (!userId) return;
    const profileSkillInput = {
      userId: userId,
      ...input,
    };

    const promise = executeAddProfileSkill({
      variables: { skill: profileSkillInput },
      optimisticResponse: {
        addProfileSkill: {
          __typename: "Profile",
          id: userId,
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

  const updateProfileSkill = async (input: IProfileSkill) => {
    if (!userId) return;
    const dataProfile = {
      userId: userId,
      ...input,
    };
    const promise = executeUpdateProfileSkill({
      variables: { skill: dataProfile },
      optimisticResponse: {
        updateProfileSkill: {
          __typename: "Profile",
          id: userId,
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
      loading: "Updating skill mastery",
      success: "Skill is updated",
      error: (err) => err.message,
      position: "top-right",
    });
  };

  const deleteProfileSkills = (input: string[]) => {
    if (!userId) return;
    const profileSkillInput = {
      userId: userId,
      name: input,
    };
    const promise = executeDeleteProfileSkills({
      variables: { skill: profileSkillInput },
      optimisticResponse: {
        deleteProfileSkill: {
          __typename: "Profile",
          id: userId,
          skills: currentSkills.filter(
            (skill) => !input.some((e) => e === skill.name),
          ),
        },
      },
    });
    toast.promise(promise, {
      loading: "Deleting skills",
      success: "Successfully deleted",
      error: (err) => err.message,
      position: "top-right",
    });
  };

  const filteredSkills = skills?.skills.filter(
    (skill) => !profileSkills?.some((e) => e.name === skill.name),
  );

  return {
    getAllSkills,
    skillCategories,
    filteredSkills,
    isCategoriesLoading,
    skills,
    isSkillsLoading,
    addProfileSkill,
    updateProfileSkill,
    isAddingLoading,
    deleteProfileSkills,
    isUpdatingLoading,
    isDeletingLoading,
  };
}
