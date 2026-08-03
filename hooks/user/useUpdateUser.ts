import { useMutation } from "@apollo/client/react";

import {
  UPDATE_PROFILE,
  UPDATE_USER,
  UPLOAD_AVATAR,
} from "@/graphql/user/mutations";
import { GET_USER } from "@/graphql/user/queries";

interface IUpdateUserData {
  userId: string;
  firstName: string;
  lastName: string;
  departmentId: string;
  positionId: string;
  avatarFile?: File | null;
  avatarBase64?: string | null;
}

export const useUpdateUser = () => {
  const [updateProfileMutation, { loading: isProfileLoading }] =
    useMutation(UPDATE_PROFILE);
  const [updateUserMutation, { loading: isUserLoading }] =
    useMutation(UPDATE_USER);
  const [uploadAvatarMutation, { loading: isAvatarLoading }] =
    useMutation(UPLOAD_AVATAR);

  const updateUser = async ({
    userId,
    firstName,
    lastName,
    departmentId,
    positionId,
    avatarFile,
    avatarBase64,
  }: IUpdateUserData) => {
    await updateProfileMutation({
      variables: {
        profile: {
          userId,
          first_name: firstName,
          last_name: lastName,
        },
      },
      refetchQueries: [{ query: GET_USER, variables: { userId } }],
    });

    await updateUserMutation({
      variables: {
        user: {
          userId,
          departmentId,
          positionId,
        },
      },
      refetchQueries: [{ query: GET_USER, variables: { userId } }],
    });

    if (avatarFile && avatarBase64) {
      try {
        await uploadAvatarMutation({
          variables: {
            avatar: {
              userId,
              base64: avatarBase64,
              size: avatarFile.size,
              type: avatarFile.type,
            },
          },
          refetchQueries: [{ query: GET_USER, variables: { userId } }],
          awaitRefetchQueries: true,
        });
      } catch (err) {
        console.warn("Ошибка загрузки аватарки:", err);
      }
    }

    return { success: true };
  };

  return {
    updateUser,
    isLoading: isProfileLoading || isUserLoading || isAvatarLoading,
  };
};
