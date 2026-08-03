import { useState } from "react";
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
import { FloatingSelect } from "@/components/ui/floating-select";
import { Icon } from "@/components/ui/icon";
import { SelectItem } from "@/components/ui/select";
import { useMe } from "@/hooks/auth/useMe";
import useCvConstructor from "@/hooks/cvs/useCvConstructor";

import { getUserIdFromToken } from "@/utils/jwt";

const CvSkillsForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { cvData } = useCvConstructor();

  const userId = getUserIdFromToken();
  const { skills, isLoading } = useMe(userId);
  const { handleSubmit, control, reset } = useForm<{ name: string }>({
    defaultValues: {
      name: "",
    },
  });

  const isInList = (name: string) =>
    cvData?.cv.skills.some((e) => e.name === name);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger
          render={
            <Button variant={"ghost"}>
              <Icon variant="add" />
              ADD SKILL
            </Button>
          }
        />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add skill</DialogTitle>
          </DialogHeader>
          <form
            id="cv-skill-form"
            className="space-y-8"
            // onSubmit={handleSubmit(onSubmit)}
          >
            <Controller
              name="name"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <FloatingSelect
                  label="Skill"
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isLoading}
                >
                  {skills?.map((skill) => (
                    <SelectItem
                      key={"cv-skill-select-" + skill.name}
                      value={skill.name}
                    >
                      {skill.name}
                    </SelectItem>
                  ))}
                </FloatingSelect>
              )}
            />
          </form>
          <DialogFooter>
            <DialogClose render={<Button variant={"outline"}>CANCEL</Button>} />
            <Button
              variant={"primary"}
              type="submit"
              disabled={isLoading}
              form="cv-skill-form"
            >
              ADD
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CvSkillsForm;
