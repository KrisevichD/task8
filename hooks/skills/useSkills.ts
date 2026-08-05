import { useLazyQuery, useMutation, useQuery } from "@apollo/client/react";

import {
  ADD_PROFILE_SKILL,
  DELETE_PROFILE_SKILL,
  GET_ALL_SKILLS,
  GET_SKILLS_CATEGORIES,
  UPDATE_CV_SKILL,
  UPDATE_PROFILE_SKILL,
} from "@/graphql/skills";
import { GET_USER } from "@/graphql/user/queries";
import { IProfileSkillInput } from "@/types/skills";
import { getUserIdFromToken } from "@/utils/jwt";
import { toast } from "sonner";
import { useParams } from "next/navigation";

export default function useSkills(customUserId?: string) {
  const userId = customUserId || getUserIdFromToken();
  const cvId = useParams().id as string;

  const { data: skillCategoriesData, loading: isCategoriesLoading } = useQuery(
    GET_SKILLS_CATEGORIES,
  );
  const [getAllSkills, { data: skills, loading: isSkillsLoading }] =
    useLazyQuery(GET_ALL_SKILLS);
  const [executeAddProfileSkill, { loading: isAddingLoading }] =
    useMutation(ADD_PROFILE_SKILL);
  const [executeUpdateProfileSkill, { loading: isUpdatingLoading }] =
    useMutation(UPDATE_PROFILE_SKILL);
  const [executeUpdateCvSkill, { loading: isCvUpdatingLoading }] =
    useMutation(UPDATE_CV_SKILL);
  const [executeDeleteProfileSkills, { loading: isDeletingLoading }] =
    useMutation(DELETE_PROFILE_SKILL);

  const skillCategories = skillCategoriesData?.skillCategories;

  const addProfileSkill = (input: Omit<IProfileSkillInput, "userId">) => {
    if (!userId) return;
    const profileSkillInput = {
      userId: userId,
      ...input,
    };
    const promise = executeAddProfileSkill({
      variables: { skill: profileSkillInput },
      refetchQueries: [{ query: GET_USER, variables: { userId } }],
    });
    toast.promise(promise, {
      loading: "Adding skill",
      success: "Successfully added",
      error: (err) => err.message,
      position: "top-right",
    })
  };

  const updateProfileSkill = async (input: IProfileSkillInput) => {
    if (!userId) return;
    if (!cvId) {
      const dataProfile = {
        userId: userId,
        ...input,
      };
      const promise = executeUpdateProfileSkill({ variables: { skill: dataProfile } });
      toast.promise((promise), {
        loading: "Updating skill mastery",
        success: "Skill is updated",
        error: (err) => err.message,
        position: "top-right",
      })
      return;
    }
    const dataCv = {
      cvId: cvId,
      ...input
    }
    const promise2 = executeUpdateCvSkill({ variables: { skill: dataCv } });
    toast.promise((promise2), {
      loading: "Updating skill mastery",
      success: "Skill is updated",
      error: (err) => err.message,
      position: "top-right",
    })
  }


  const deleteProfileSkills = (input: string[]) => {
    if (!userId) return;
    const profileSkillInput = {
      userId: userId,
      name: input,
    };
    const promise = executeDeleteProfileSkills({ variables: { skill: profileSkillInput } });
    toast.promise(promise, {
      loading: "Deleting skills",
      success: "Successfully deleted",
      error: (err) => err.message,
      position: "top-right",
    })
  };

  return {
    getAllSkills,
    skillCategories,
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
