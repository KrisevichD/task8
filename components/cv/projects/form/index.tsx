import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

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

interface FormData extends ICreateProjectInput {
  responsibilities: string;
}

const INITIAL_FORM_DATA = {
      name: "",
      domain: "",
      start_date: new Date().toLocaleString(),
      end_date: new Date().toLocaleString(),
      description: "",
      environment: [],
      responsibilities: "",
    }

const CvProjectsForm = ({initialData}: {initialData?: ICreateCvProjectForm}) => {
  const [isOpen, setIsOpen] = useState(false);
  const params = useParams();
  const { addCvProject } = useCvConstructor();
  const { getAllSkills, skills } = useSkills();

  const { register, control, handleSubmit } = useForm<ICreateCvProjectForm>({
    defaultValues: initialData ?? INITIAL_FORM_DATA
  });

  useEffect(() => {
    if (isOpen) {
      getAllSkills();
    }
  }, [isOpen]);

  const onSubmit = async (formData: ICreateCvProjectForm) => {
      await addCvProject(formData)
      setIsOpen(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger
          render={
            !initialData 
            ?
            <Button
              variant={"ghost"}
              type="button"
              className={"text-primary hover:text-primary"}
            >
              <Icon variant="add" />
              Add project
            </Button>
            :
            <DialogTrigger onClick={() => setIsOpen(true)}>Edit</DialogTrigger>
          }
        />
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
              <FloatingInput {...register("name")} label="Project" />
              <FloatingInput {...register("domain")} label="Domain" />
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
            />
            <Controller
              name="environment"
              control={control}
              render={({ field }) => (
                <FloatingSelect
                  label="Environment"
                  multiple
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
