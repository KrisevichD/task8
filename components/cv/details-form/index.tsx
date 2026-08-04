import React, { useEffect } from "react";

import { useForm } from "react-hook-form";

import { toast } from "sonner";

import { FloatingInput } from "../../ui/floating-input";

import { Button } from "@/components/ui/button";
import { FloatingTextarea } from "@/components/ui/floating-textarea";
import useCvConstructor from "@/hooks/cvs/useCvConstructor";
import { ICvDetailsForm } from "@/types/cv-constructor";

const CvDetailsForm = () => {
  const { cvData, updateCv } = useCvConstructor();

  const { register, reset, handleSubmit } = useForm<ICvDetailsForm>({
    defaultValues: {
      name: "",
      description: "",
      education: "",
    },
  });

  useEffect(() => {
    if (cvData)
      reset({
        name: cvData.cv.name,
        description: cvData.cv.description,
        education: cvData.cv.education,
      });
  }, [cvData, reset]);

  const onSubmit = (formData: ICvDetailsForm) => {
    if (!cvData) return;
    const data = {
      cvId: cvData.cv.id,
      ...formData,
    };
    const status = updateCv(data);
    toast.promise(status, {
      loading: "Updating data",
      success: "CV successfully updated",
      error: (error) => {
        return error.message;
      },
      position: "top-right",
    });
  };

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
      <Button type="submit" variant={"secondary"} size={"lg"}>
        UPDATE
      </Button>
    </form>
  );
};

export default CvDetailsForm;
