import { useEffect, useState } from "react";

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
import useSkills from "@/hooks/skills/useSkills";
import { ISkill, TSkillMastery } from "@/types/skills";

const SkillsForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [skill, setSkill] = useState<ISkill | null>(null);
  const [skillMastery, setSkillMastery] = useState<TSkillMastery>("Novice");
  const { skills: selectedSkills } = useMe();
  const {
    getAllSkills,
    skills,
    isSkillsLoading,
    addProfileSkill,
    isAddingLoading,
  } = useSkills();

  useEffect(() => {
    if (isOpen) {
      getAllSkills();
    }
  }, [isOpen, getAllSkills]);

  const onSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!skill) return;
    const categoryId = skill.category.id;
    const data = {
      name: skill.name,
      mastery: skillMastery,
      categoryId: categoryId,
    };
    await addProfileSkill(data);
    setIsOpen(false);
  };

  const filteredSkills = skills?.skills.filter(
    (skill) => !selectedSkills?.some((e) => e.name === skill.name),
  );

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
          <form id="cv-skill-form" className="space-y-8" onSubmit={onSubmit}>
            <FloatingSelect
              label="Skill"
              value={skill?.name ?? ""}
              onValueChange={(value) =>
                setSkill(skills?.skills.find((e) => e.name === value) ?? null)
              }
              disabled={isSkillsLoading || isAddingLoading}
            >
              {filteredSkills?.map((skill) => {
                return (
                  <SelectItem
                    key={`select-skill-${skill.name}`}
                    value={skill.name}
                  >
                    {skill.name}
                  </SelectItem>
                );
              })}
            </FloatingSelect>

            <FloatingSelect
              label="Skill mastery"
              value={skillMastery}
              onValueChange={(value) => setSkillMastery(value as TSkillMastery)}
              disabled={isSkillsLoading || isAddingLoading}
            >
              <SelectItem value={"Novice"}>Novice</SelectItem>
              <SelectItem value={"Advanced"}>Advanced</SelectItem>
              <SelectItem value={"Competent"}>Competent</SelectItem>
              <SelectItem value={"Proficient"}>Proficient</SelectItem>
              <SelectItem value={"Expert"}>Expert</SelectItem>
            </FloatingSelect>
          </form>
          <DialogFooter>
            <DialogClose render={<Button variant={"outline"}>CANCEL</Button>} />
            <Button
              variant={"primary"}
              type="submit"
              disabled={isSkillsLoading || isAddingLoading}
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

export default SkillsForm;
