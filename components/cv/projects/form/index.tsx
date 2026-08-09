import { useParams } from "next/navigation";
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
import { useLanguage } from "@/context/language";
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
  type = "add",
  id,
  editingId,
  closeEditing,
  initialData,
}: {
  type?: "add" | "edit";
  id?: string;
  editingId?: string;
  closeEditing?: () => void;
  initialData?: ICreateCvProjectForm;
}) => {
  const { t } = useLanguage();
  const cvId = useParams().id as string;
  const isEditing = type === "edit" && editingId ? true : false;
  const action = isEditing ? t("update") : t("add");
  const [isOpen, setIsOpen] = useState(false);
  const { addCvProject, updateCvProject } = useCvConstructor(cvId);
  const { getAllSkills, skills } = useSkills();

  const {
    register,
    reset,
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm<ICreateCvProjectForm>({
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
    } else {
      await addCvProject(formData);
      setIsOpen(false);
    }
  };

  return (
    <>
      <Dialog
        open={isEditing ? isEditing : isOpen}
        onOpenChange={isEditing ? closeEditing : setIsOpen}
      >
        {type === "add" && (
          <DialogTrigger
            render={
              <Button
                variant={"ghost"}
                type="button"
                className={
                  "text-primary hover:text-primary max-lg:bg-primary/4 max-lg:size-10"
                }
              >
                <Icon variant="add" />
                <span className="max-lg:sr-only uppercase">
                  {t("add")} {t("project")}
                </span>
              </Button>
            }
          />
        )}
        <DialogContent>
          <DialogHeader>
            <DialogTitle className={"sentence-case"}>
              {action} {t("project")}
            </DialogTitle>
          </DialogHeader>
          <form
            id="project-form"
            onSubmit={handleSubmit(onSubmit, onValidationError)}
            className="space-y-3"
          >
            <div className="grid grid-cols-2 gap-3">
              <FloatingInput
                {...register("name", {
                  required: `${t("project")}${t("isRequired")}`,
                })}
                label={t("project")}
                disabled={isEditing}
              />
              <FloatingInput
                {...register("domain", {
                  required: `${t("domain")}${t("isRequired")}`,
                })}
                label={t("domain")}
                disabled={isEditing}
              />
              <FloatingInput
                {...register("start_date", {
                  required: `${t("startDate")}${t("isRequired")}`,
                })}
                type="date"
                label={t("startDate")}
              />
              <FloatingInput
                {...register("end_date", {
                  required: `${t("endDate")}${t("isRequired")}`,
                })}
                type="date"
                label={t("endDate")}
              />
            </div>
            <FloatingTextarea
              {...register("description", {
                required: `${t("description")}${t("isRequired")}`,
              })}
              label={t("description")}
              disabled={isEditing}
            />
            <Controller
              name="environment"
              control={control}
              render={({ field }) => (
                <FloatingSelect
                  label={t("environment")}
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
              label={t("responcibilities")}
            />
          </form>
          <DialogFooter>
            <DialogClose
              render={
                <Button
                  variant={"outline"}
                  className={"uppercase"}
                  type="button"
                >
                  {t("cancel")}
                </Button>
              }
            />
            <Button
              variant={"primary"}
              type="submit"
              className={"uppercase"}
              form="project-form"
              disabled={!isDirty && isEditing}
            >
              {action}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CvProjectsForm;
