import { useEffect, useState } from "react";

import { Controller, useForm } from "react-hook-form";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FloatingInput } from "@/components/ui/floating-input";
import { FloatingSelect } from "@/components/ui/floating-select";
import { FloatingTextarea } from "@/components/ui/floating-textarea";
import { Icon } from "@/components/ui/icon";
import { SelectItem } from "@/components/ui/select";
import useCvConstructor from "@/hooks/cvs/useCvConstructor";
import useSkills from "@/hooks/skills/useSkills";
import { ICreateCvProjectForm } from "@/types/cv-constructor";

const INITIAL_FORM_DATA = {
  name: "",
  domain: "",
  start_date: new Date().toLocaleString(),
  end_date: new Date().toLocaleString(),
  description: "",
  environment: [],
  responsibilities: "",
};

const CvProjectsForm = ({
  id,
  isEditing,
  closeEditing,
  initialData,
}: {
  id?: string;
  isEditing?: boolean;
  closeEditing?: () => void;
  initialData?: ICreateCvProjectForm;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { addCvProject, updateCvProject } = useCvConstructor();
  const { getAllSkills, skills } = useSkills();

  const { register, reset, control, handleSubmit } =
    useForm<ICreateCvProjectForm>({
      defaultValues: initialData ?? INITIAL_FORM_DATA,
    });

  useEffect(() => {
    if (isOpen) {
      getAllSkills();
      reset(initialData ?? INITIAL_FORM_DATA);
    }
  }, [isOpen, initialData, reset, getAllSkills]);

  const onValidationError = (errors: any) => {
    const firstErrorField = Object.keys(errors)[0];
    const errorMessage =
      errors[firstErrorField]?.message || "Please fill in all required fields";
    toast.error(errorMessage, { position: "top-right" });
  };

  const onSubmit = async (formData: ICreateCvProjectForm) => {
    if (isEditing) {
      if (!id || !closeEditing) return;
      await updateCvProject(id, formData);
      closeEditing();
      toast.success("Project updated", { position: "top-right" });
    } else {
      await addCvProject(formData);
      setIsOpen(false);
      toast.success("Project added", { position: "top-right" });
    }
  };

  return (
    <>
      <Dialog
        open={isEditing !== undefined ? isEditing : isOpen}
        onOpenChange={isEditing !== undefined ? closeEditing : setIsOpen}
      >
        {isEditing === undefined && (
          <DialogTrigger
            render={
              <Button
                variant={"ghost"}
                type="button"
                className={"text-primary hover:text-primary"}
              >
                <Icon variant="add" />
                Add project
              </Button>
            }
          />
        )}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add project</DialogTitle>
          </DialogHeader>
          <form
            id="project-form"
            onSubmit={handleSubmit(onSubmit, onValidationError)}
            className="space-y-3"
          >
            <div className="grid grid-cols-2 gap-3">
              <FloatingInput
                {...register("name", {
                  required: "Project name is required",
                  minLength: {
                    value: 2,
                    message: "Min length is 2 characters",
                  },
                })}
                label="Project"
                disabled={isEditing}
              />
              <FloatingInput
                {...register("domain", {
                  required: "Domain is required",
                })}
                label="Domain"
                disabled={isEditing}
              />
              <FloatingInput
                {...register("start_date", {
                  required: "Start date is required",
                })}
                type="date"
                label="Start Date"
              />
              <FloatingInput
                {...register("end_date", {
                  required: "End date is required",
                })}
                type="date"
                label="End Date"
              />
            </div>
            <FloatingTextarea
              {...register("description", {
                required: "Description is required",
              })}
              label="Description"
              disabled={isEditing}
            />
            <Controller
              name="environment"
              control={control}
              render={({ field }) => (
                <FloatingSelect
                  label="Environment"
                  multiple
                  disabled={isEditing}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  {skills?.skills.map((skill) => (
                    <SelectItem
                      key={`environment-${skill.id}`}
                      value={skill.name}
                    >
                      {skill.name}
                    </SelectItem>
                  ))}
                </FloatingSelect>
              )}
            />
            <FloatingTextarea
              {...register("responsibilities")}
              label="Responsibilities"
            />
          </form>
          <DialogFooter>
            <DialogClose
              render={
                <Button variant={"outline"} type="button">
                  CANCEL
                </Button>
              }
            />
            <Button variant={"primary"} type="submit" form="project-form">
              {isEditing ? "UPDATE" : "ADD"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CvProjectsForm;
