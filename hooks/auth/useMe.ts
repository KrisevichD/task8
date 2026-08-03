import { useQuery } from "@apollo/client/react";

import { GET_USER } from "@/graphql/user/queries";
import { getUserIdFromToken } from "@/utils/jwt";

export const useMe = (userId1?: string) => {
  const userId = getUserIdFromToken();

  const {
    data,
    loading: isLoading,
    error,
  } = useQuery(GET_USER, {
    variables: { userId: userId! },
    skip: !userId,
  });

  const user = data?.user;
  const firstName = user?.profile?.first_name || "";
  const lastName = user?.profile?.last_name || "";

  const fullName = `${firstName} ${lastName}`.trim() || user?.email || "User";

  const initials =
    `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase() ||
    user?.email?.[0]?.toUpperCase() ||
    "U";

  const positionName = user?.position_name || "";

  const skills = user?.profile?.skills;
  const languages = user?.profile?.languages;

  return {
    user,
    fullName,
    initials,
    avatarUrl: user?.profile?.avatar,
    positionName,
    skills,
    languages,
    isLoading,
    error,
  };
};
