import { useState } from "react";

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

import { IAddCvSkillInput } from "@/types/cv-constructor";
import { getUserIdFromToken } from "@/utils/jwt";
import { IProfileSkill } from "@/types/skills";

const CvSkillsForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [skill, setSkill] = useState("");
  const { cvData, addCvSkill } = useCvConstructor();

  const userId = getUserIdFromToken();
  const { skills, isLoading } = useMe(userId);

  const filteredSkills = skills?.filter(
    (profileSkill) =>
      !cvData?.cv.skills.map((e) => e.name).includes(profileSkill.name),
  );

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newSkill = skills?.find((e) => e.name === skill);
    if (!newSkill) return;
    const data = {
      name: newSkill.name,
      mastery: newSkill.mastery,
      categoryId: newSkill.categoryId,
    } as IProfileSkill;

    await addCvSkill(data);
    setIsOpen(false);
  };

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
            onSubmit={handleSubmit}
          >
            <FloatingSelect
              label="Skill"
              value={skill}
              onValueChange={(value) => setSkill(value as string)}
              disabled={isLoading}
            >
              {filteredSkills?.map((skill) => (
                <SelectItem
                  key={"cv-skill-select-" + skill.name}
                  value={skill.name}
                >
                  {skill.name}
                </SelectItem>
              ))}
            </FloatingSelect>
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
