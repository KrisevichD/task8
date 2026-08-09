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
import useSkills from "@/hooks/skills/useSkills";
import { IProfileSkill, ISkill, TSkillMastery } from "@/types/skills";

const SkillsForm = ({
  selectedSkills,
  cancelEditing,
  userId,
}: {
  selectedSkills: IProfileSkill[];
  cancelEditing: () => void;
  userId?: string;
}) => {
  const { t } = useLanguage();
  const skillMasterySelectItems = [
    { value: "Novice", label: t("novise") },
    { value: "Advanced", label: t("advanced") },
    { value: "Competent", label: t("competent") },
    { value: "Proficient", label: t("proficient") },
    { value: "Expert", label: t("expert") },
  ];
  const isEditing = selectedSkills.length === 1;
  const action = isEditing ? t("update") : t("add");
  const [isOpen, setIsOpen] = useState(false);
  const [skill, setSkill] = useState<ISkill | null>(null);
  const [skillMastery, setSkillMastery] = useState<TSkillMastery>("Novice");
  const {
    getAllSkills,
    filteredSkills,
    isSkillsLoading,
    addProfileSkill,
    updateProfileSkill,
    isUpdatingLoading,
  } = useSkills(userId);

  const [prevSelectedSkill, setPrevSelectedSkill] = useState<string | null>(
    null,
  );
  const currentSelectedSkill = isEditing ? selectedSkills[0].name : null;
  if (currentSelectedSkill !== prevSelectedSkill) {
    setPrevSelectedSkill(currentSelectedSkill);
    setSkillMastery(isEditing ? selectedSkills[0].mastery : "Novice");
  }

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
      toast.error(t("toastErrorSkill"), { position: "top-right" });
      return;
    }

    setIsOpen(false);
    const categoryId = submitSkill.category.id;
    const data = {
      name: submitSkill.name,
      mastery: skillMastery,
      categoryId: categoryId,
    };
    if (isEditing) {
      await updateProfileSkill(data);
    } else {
      await addProfileSkill(data);
    }
    cancelEditing();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger
          render={
            <Button variant={"ghost"} className={"uppercase"}>
              {!isEditing && <Icon variant="add" />}
              {action} {t("skill")}
            </Button>
          }
        />
        <DialogContent>
          <DialogHeader>
            <DialogTitle className={"sentence-case"}>
              {action} {t("skill")}
            </DialogTitle>
          </DialogHeader>
          <form id="cv-skill-form" className="space-y-8" onSubmit={onSubmit}>
            <FloatingSelect
              label={t("skill")}
              value={isEditing ? selectedSkills[0].name : (skill?.name ?? "")}
              onValueChange={(value) =>
                setSkill(filteredSkills?.find((e) => e.name === value) ?? null)
              }
              disabled={isSkillsLoading || isEditing}
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
              label={t("skillMastery")}
              items={skillMasterySelectItems}
              value={skillMastery}
              onValueChange={(value) => setSkillMastery(value as TSkillMastery)}
              disabled={isSkillsLoading}
            >
              {skillMasterySelectItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </FloatingSelect>
          </form>
          <DialogFooter>
            <DialogClose
              render={
                <Button variant={"outline"} className={"uppercase"}>
                  {t("cancel")}
                </Button>
              }
            />
            <Button
              variant={"primary"}
              type="submit"
              className={"uppercase"}
              disabled={
                isSkillsLoading ||
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

export default SkillsForm;
