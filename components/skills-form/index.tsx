"use client";

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
import { useLanguage } from "@/context/language";
import { useMe } from "@/hooks/auth/useMe";
import useSkills from "@/hooks/skills/useSkills";
import { IProfileSkill, ISkill, TSkillMastery } from "@/types/skills";
import { toast } from "sonner";

interface ISkillsFormProps {
  selectedSkills: IProfileSkill[];
  cancelEditing: () => void;
  userId?: string;
}

const SkillsForm = ({ selectedSkills, cancelEditing, userId }: ISkillsFormProps) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [skill, setSkill] = useState<ISkill | null>(null);
  const [skillMastery, setSkillMastery] = useState<TSkillMastery>("Novice");
  
  // Подтягиваем данные пользователя с учетом переданного userId
  const { skills: profileSkills } = useMe(userId);
  
  const isEditing = selectedSkills?.length === 1;
  const action = isEditing ? "Update" : "Add";

  const {
    getAllSkills,
    skills,
    isSkillsLoading,
    addProfileSkill,
    isAddingLoading,
    updateProfileSkill,
    isUpdatingLoading,
  } = useSkills(userId);

  useEffect(() => {
    if (isOpen) {
      getAllSkills();
    }
  }, [isOpen, getAllSkills]);

  useEffect(() => {
    if (isEditing && selectedSkills?.[0]) {
      setSkillMastery(selectedSkills[0].mastery);
    }
  }, [isEditing, selectedSkills]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

    const data = {
      name: submitSkill.name,
      mastery: skillMastery,
      categoryId: submitSkill.category.id,
    };

    if (isEditing) {
      await updateProfileSkill(data);
    } else {
      await addProfileSkill(data);
    }

    setIsOpen(false);
    cancelEditing();
  };

  // Исключаем из списка выбора те навыки, которые уже добавлены в профиль пользователя
  const filteredSkills = skills?.skills.filter(
    (item) => !profileSkills?.some((e) => e.name === item.name),
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        render={
          <Button variant="ghost" className="uppercase">
            <Icon variant="add" />
            {isEditing ? "UPDATE SKILL" : `${t("addSkill")}`}
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Update skill" : `${t("addSkill")}`}
          </DialogTitle>
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
            {(filteredSkills ?? skills?.skills)?.map((s) => (
              <SelectItem key={`select-skill-${s.name}`} value={s.name}>
                {s.name}
              </SelectItem>
            ))}
          </FloatingSelect>

          <FloatingSelect
            label="Skill mastery"
            value={skillMastery}
            onValueChange={(value) => setSkillMastery(value as TSkillMastery)}
            disabled={isSkillsLoading || isAddingLoading || isUpdatingLoading}
          >
            <SelectItem value="Novice">Novice</SelectItem>
            <SelectItem value="Advanced">Advanced</SelectItem>
            <SelectItem value="Competent">Competent</SelectItem>
            <SelectItem value="Proficient">Proficient</SelectItem>
            <SelectItem value="Expert">Expert</SelectItem>
          </FloatingSelect>
        </form>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">CANCEL</Button>} />
          <Button
            variant="primary"
            type="submit"
            className="uppercase"
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
  );
};

export default SkillsForm;
