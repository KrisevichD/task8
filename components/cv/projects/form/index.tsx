import { useState } from "react";

import { useForm } from "react-hook-form";

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
import { useCVContext } from "@/context/cv";
import { ICVProject } from "@/types/cv";

const CVProjectsForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data, updateDataByKey } = useCVContext();

  const { register, reset, handleSubmit } = useForm<ICVProject>({
    defaultValues: {
      project: "",
      domain: "",
      startDate: new Date(),
      endDate: new Date(),
      description: "",
      enviroment: [],
      responsibilities: "",
    },
  });

  const onSubmit = (formData: ICVProject) => {
    updateDataByKey("projects", [...data.projects, formData as ICVProject]);
    reset();
    setIsOpen(false);
    console.log("formData");
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
              <FloatingInput {...register("project")} label="Project" />
              <FloatingInput {...register("domain")} label="Domain" />
              <FloatingInput
                {...register("startDate")}
                type="date"
                label="Start Date"
              />
              <FloatingInput
                {...register("endDate")}
                type="date"
                label="End Date"
              />
            </div>
            <FloatingTextarea
              {...register("description")}
              label="Description"
            />
            <FloatingSelect label="Enviroment">
              <SelectItem value={1}>Tag</SelectItem>
              <SelectItem value={2}>Tag</SelectItem>
            </FloatingSelect>
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

export default CVProjectsForm;
