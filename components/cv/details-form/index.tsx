import React, { useEffect } from "react";

import { useForm } from "react-hook-form";

import { toast } from "sonner";

import { FloatingInput } from "../../ui/floating-input";

import { Button } from "@/components/ui/button";
import { FloatingTextarea } from "@/components/ui/floating-textarea";
import useCvConstructor from "@/hooks/cvs/useCvConstructor";
import { ICvDetailsForm, ICvResponce } from "@/types/cv-constructor";
import { Spinner } from "@/components/ui/spinner";

const CvDetailsForm = ({ cvData }: { cvData: ICvResponce }) => {
  const { updateCv } = useCvConstructor(cvData.id);

  const { register, reset, handleSubmit, formState: { isDirty } } = useForm<ICvDetailsForm>({
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

  if (!cvData) return <Spinner />

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-end gap-9 mt-8 lg:ml-48.25 lg:mr-48.75"
    >
      <FloatingInput {...register("name")} label="Name" />
      <FloatingInput {...register("education")} label="Education" />
      <FloatingTextarea
        {...register("description")}
        className="min-h-46.25"
        label="Description"
      />
      <Button type="submit" variant={"primary"} size={"lg"} disabled={!isDirty}>
        UPDATE
      </Button>
    </form>
  );
};

export default CvDetailsForm;
