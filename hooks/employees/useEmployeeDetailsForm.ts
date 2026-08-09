import { useQuery } from "@apollo/client/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { GET_DEPARTMENTS } from "@/graphql/department/queries";
import { GET_POSITIONS } from "@/graphql/position/queries";
import { IUserData } from "@/graphql/user/queries";
import { useUpdateUser } from "@/hooks/user/useUpdateUser";
import { getUserIdFromToken } from "@/utils/jwt";

export interface IProfileFormValues {
  firstName: string;
  lastName: string;
  departmentId: string;
  positionId: string;
}

export const useEmployeeDetailsForm = (userId: string, user?: IUserData) => {
  const { updateUser, isLoading: isUpdating } = useUpdateUser();

  const [currentUserId] = useState<string | undefined>(() => {
    if (typeof window === "undefined") return undefined;
    const id = getUserIdFromToken();
    return id !== undefined ? String(id) : undefined;
  });

  const isOwner = Boolean(
    currentUserId &&
    (String(currentUserId) === String(userId) ||
      String(currentUserId) === String(user?.id)),
  );

  const { data: departmentsData } = useQuery(GET_DEPARTMENTS);
  const { data: positionsData } = useQuery(GET_POSITIONS);

  const departments = departmentsData?.departments || [];
  const positions = positionsData?.positions || [];

  const form = useForm<IProfileFormValues>({
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      departmentId: "",
      positionId: "",
    },
  });

  const {
    reset,
    formState: { isDirty, isValid },
  } = form;

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarBase64, setAvatarBase64] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.profile?.first_name || "",
        lastName: user.profile?.last_name || "",
        departmentId: user.department_name || "",
        positionId: user.position_name || "",
      });
    }
  }, [user?.id, user, reset]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 0.5 * 1024 * 1024) {
        alert("File size should be no more than 0.5MB");
        return;
      }

      setAvatarFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAvatarPreview(result);
        setAvatarBase64(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: IProfileFormValues) => {
    const selectedDeptObj = departments.find(
      (d) => d.name === values.departmentId || d.id === values.departmentId,
    );
    const selectedPosObj = positions.find(
      (p) => p.name === values.positionId || p.id === values.positionId,
    );

    await updateUser({
      userId,
      firstName: values.firstName,
      lastName: values.lastName,
      departmentId: selectedDeptObj?.id || values.departmentId,
      positionId: selectedPosObj?.id || values.positionId,
      avatarFile,
      avatarBase64,
    });

    setAvatarFile(null);
    setAvatarBase64(null);
    reset(values);
  };

  const isAvatarChanged = Boolean(avatarFile);
  const canSubmit = (isDirty || isAvatarChanged) && isValid;

  return {
    form,
    isOwner,
    departments,
    positions,
    avatarPreview,
    isUpdating,
    canSubmit,
    handleAvatarChange,
    onSubmit,
  };
};
