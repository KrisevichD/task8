import { useQuery } from "@apollo/client/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useLanguage } from "@/context/language";
import { GET_DEPARTMENTS } from "@/graphql/department/queries";
import { GET_POSITIONS } from "@/graphql/position/queries";
import { IUserData } from "@/graphql/user/queries";
import { useUpdateUser } from "@/hooks/user/useUpdateUser";

export interface IProfileFormValues {
  firstName: string;
  lastName: string;
  departmentId: string;
  positionId: string;
}

export const useEmployeeDetailsForm = (userId: string, user?: IUserData) => {
  const { t } = useLanguage();
  const { updateUser, isLoading: isUpdating } = useUpdateUser();

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
        toast.error(
          `${t("errorMessage")} File size should be no more than 0.5MB`,
          {
            position: "top-right",
          },
        );
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

    const updatePromise = updateUser({
      userId,
      firstName: values.firstName,
      lastName: values.lastName,
      departmentId: selectedDeptObj?.id || values.departmentId,
      positionId: selectedPosObj?.id || values.positionId,
      avatarFile,
      avatarBase64,
    });

    toast.promise(updatePromise, {
      loading: `${t("updating")} ${t("profile").toLowerCase()}...`,
      success: `${t("profile")} ${t("successfully")} ${t("updated")}!`,
      error: (err) => `${t("errorMessage")} ${err.message}`,
      position: "top-right",
    });

    try {
      await updatePromise;
      setAvatarFile(null);
      setAvatarBase64(null);
      reset(values);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const isAvatarChanged = Boolean(avatarFile);
  const canSubmit = (isDirty || isAvatarChanged) && isValid;

  return {
    form,
    departments,
    positions,
    avatarPreview,
    isUpdating,
    canSubmit,
    handleAvatarChange,
    onSubmit,
  };
};
