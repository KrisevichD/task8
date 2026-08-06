import { useEffect, useState } from "react";

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
import { FloatingSelect } from "@/components/ui/floating-select";
import { Icon } from "@/components/ui/icon";
import { SelectItem } from "@/components/ui/select";
import { useLanguage } from "@/context/language";
import useCvConstructor from "@/hooks/cvs/useCvConstructor";
import useSkills from "@/hooks/skills/useSkills";
import { ICvResponce } from "@/types/cv-constructor";
import { IProfileSkill, ISkill, TSkillMastery } from "@/types/skills";

const CvSkillsForm = ({
  selectedSkills,
  cancelEditing,
  userId,
  cvData,
}: {
  selectedSkills: IProfileSkill[];
  cancelEditing: () => void;
  userId: string;
  cvData: ICvResponce;
}) => {
  const { t } = useLanguage();
  const isEditing = selectedSkills.length === 1;
  const action = isEditing ? "Update" : "Add";
  const [isOpen, setIsOpen] = useState(false);
  const [skill, setSkill] = useState<ISkill | null>(null);
  const [skillMastery, setSkillMastery] = useState<TSkillMastery>(
    isEditing ? selectedSkills[0].mastery : "Novice",
  );
  const { addCvSkill, updateCvSkill } = useCvConstructor(cvData.id);
  const {
    getAllSkills,
    skills,
    isSkillsLoading,
    isAddingLoading,
    isUpdatingLoading,
  } = useSkills(userId, cvData?.id);

  useEffect(() => {
    if (isOpen) {
      getAllSkills();
    }
  }, [isOpen, getAllSkills]);

  const onSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const submitSkill = !isEditing
      ? skill
      : {
          name: selectedSkills[0].name,
          category: {
            id: selectedSkills[0].categoryId,
          },
        };
    if (!submitSkill) {
      toast.error("Choose skill", { position: "top-right" });
      return;
    }
    const categoryId = submitSkill.category.id;
    const data = {
      name: submitSkill.name,
      mastery: skillMastery,
      categoryId: categoryId,
    };
    if (isEditing) {
      await updateCvSkill(data);
    } else {
      await addCvSkill(data);
    }
    setIsOpen(false);
    cancelEditing();
  };

  const filteredSkills = skills?.skills.filter(
    (skill) => !cvData.skills.some((e) => e.name === skill.name),
  );

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger
          render={
            <Button variant={"ghost"} className={"uppercase"}>
              <Icon variant="add" />
              {action} SKILL
            </Button>
          }
        />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{action} skill</DialogTitle>
          </DialogHeader>
          <form id="cv-skill-form" className="space-y-8" onSubmit={onSubmit}>
            <FloatingSelect
              label="Skill"
              value={isEditing ? selectedSkills[0].name : (skill?.name ?? "")}
              onValueChange={(value) =>
                setSkill(skills?.skills.find((e) => e.name === value) ?? null)
              }
              disabled={isSkillsLoading || isAddingLoading || isEditing}
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
              className={"uppercase"}
              disabled={
                isSkillsLoading ||
                isAddingLoading ||
                isUpdatingLoading ||
                (isEditing && skillMastery === selectedSkills[0].mastery)
              }
              form="cv-skill-form"
            >
              {action}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CvSkillsForm;
