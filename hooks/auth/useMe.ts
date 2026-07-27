import { useQuery } from "@apollo/client/react";

import { GET_USER } from "@/graphql/user/queries";

export const useMe = (userId?: string) => {
  const {
    data,
    loading: isLoading,
    error,
  } = useQuery(GET_USER, {
    variables: { userId: userId || "" },
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

  return {
    user,
    fullName,
    initials,
    avatarUrl: user?.profile?.avatar,
    isLoading,
    error,
  };
};
