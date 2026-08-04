import { useParams } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { Controller, useForm } from "react-hook-form";

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
import { ICreateCvProjectForm, ICreateProjectInput } from "@/types/cv-constructor";
import { validateDateString } from "@/utils/helpers";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

const INITIAL_FORM_DATA = {
      name: "",
      domain: "",
      start_date: new Date().toLocaleString(),
      end_date: new Date().toLocaleString(),
      description: "",
      environment: [],
      responsibilities: "",
    }

const CvProjectsForm = ({
  isEditing, 
  setIsEditing, 
  initialData
}: { 
  isEditing?: boolean, 
  setIsEditing?: Dispatch<SetStateAction<boolean>>, 
  initialData?: ICreateCvProjectForm
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { addCvProject } = useCvConstructor();
  const { getAllSkills, skills } = useSkills();

  const { register, reset, control, handleSubmit } = useForm<ICreateCvProjectForm>({
    defaultValues: initialData ?? INITIAL_FORM_DATA
  });

  useEffect(() => {
    if (isOpen) {
      getAllSkills();
      reset(initialData ?? INITIAL_FORM_DATA)
    }
  }, [isOpen, initialData, reset, getAllSkills]);

  const onSubmit = async (formData: ICreateCvProjectForm) => {
      await addCvProject(formData)
      setIsOpen(false);
  };

  return (
    <>
      <Dialog open={isEditing !== undefined ? isEditing : isOpen} onOpenChange={isEditing !== undefined ? setIsEditing : setIsOpen}>
        {!isEditing && <DialogTrigger render={
            <Button
              variant={"ghost"}
              type="button"
              className={"text-primary hover:text-primary"}
            >
              <Icon variant="add" />
              Add project
            </Button>
          }
        />}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add project</DialogTitle>
          </DialogHeader>
          <form
            id="project-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-3"
          >
            <div className="grid grid-cols-2 gap-3">
              <FloatingInput 
              {...register("name")} 
              label="Project" 
              disabled={isEditing}
              />
              <FloatingInput 
              {...register("domain")} 
              label="Domain" 
              disabled={isEditing}
              />
              <FloatingInput
                {...register("start_date")}
                type="date"
                label="Start Date"
              />
              <FloatingInput
                {...register("end_date")}
                type="date"
                label="End Date"
              />
            </div>
            <FloatingTextarea
              {...register("description")}
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
              ADD
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CvProjectsForm;
