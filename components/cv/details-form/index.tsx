import React, { useEffect } from "react";

import { useForm, useWatch } from "react-hook-form";

import { FloatingInput } from "../../ui/floating-input";

import { Button } from "@/components/ui/button";
import { FloatingTextarea } from "@/components/ui/floating-textarea";
import { useCVContext } from "@/context/cv";
import { ICVDetails } from "@/types/cv";

const CVDetailsForm = () => {
  const { data, updateDataByKey } = useCVContext();

  const { register, control, handleSubmit } = useForm<ICVDetails>({
    defaultValues: data.details,
  });

  const formData = useWatch({ control });

  const onSubmit = () => {
    console.log(formData);
  };

  useEffect(() => {
    if (formData) {
      updateDataByKey("details", formData as ICVDetails);
    }
  }, [formData, updateDataByKey]);

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

export default CVDetailsForm;
