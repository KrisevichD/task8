import React, { useEffect } from "react";

import { useForm } from "react-hook-form";

import { FloatingInput } from "../../ui/floating-input";

import { Button } from "@/components/ui/button";
import { FloatingTextarea } from "@/components/ui/floating-textarea";
import { Spinner } from "@/components/ui/spinner";
import { useLanguage } from "@/context/language";
import useCvConstructor from "@/hooks/cvs/useCvConstructor";
import { ICvDetailsForm, ICvResponce } from "@/types/cv-constructor";

const CvDetailsForm = ({ cvData }: { cvData: ICvResponce }) => {
  const { t } = useLanguage();
  const { updateCv } = useCvConstructor(cvData.id);

  const {
    register,
    reset,
    handleSubmit,
    formState: { isDirty },
  } = useForm<ICvDetailsForm>({
    defaultValues: {
      name: "",
      description: "",
      education: "",
    },
  });

  useEffect(() => {
    if (cvData)
      reset({
        name: cvData.name,
        description: cvData.description,
        education: cvData.education,
      });
  }, [cvData, reset]);

  const onSubmit = (formData: ICvDetailsForm) => {
    if (!cvData) return;
    const data = {
      cvId: cvData.id,
      ...formData,
    };
    updateCv(data);
  };

  if (!cvData) return <Spinner />;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-end gap-9 mt-8 lg:ml-48.25 lg:mr-48.75"
    >
      <FloatingInput {...register("name")} label={t("name")} />
      <FloatingInput {...register("education")} label={t("education")} />
      <FloatingTextarea
        {...register("description")}
        className="min-h-46.25"
        label={t("description")}
      />
      <Button
        type="submit"
        className={"uppercase"}
        variant={"primary"}
        size={"lg"}
        disabled={!isDirty}
      >
        {t("update")}
      </Button>
    </form>
  );
};

export default CvDetailsForm;
