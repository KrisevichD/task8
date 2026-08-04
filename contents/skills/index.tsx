"use client";

import { useState } from "react";

import SkillsForm from "@/components/skills-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import SkillBadge from "@/components/ui/skill-badge";
import { Spinner } from "@/components/ui/spinner";
import { Toggle } from "@/components/ui/toggle";
import { useLanguage } from "@/context/language";
import { useMe } from "@/hooks/auth/useMe";
import useSkills from "@/hooks/skills/useSkills";
import { getUserIdFromToken } from "@/utils/jwt";

interface ISkillsContentProps {
  userId?: string;
}

export const SkillsContent = ({
  userId: customUserId,
}: ISkillsContentProps) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  // Берем переданный userId или используем токен
  const userId = customUserId || getUserIdFromToken() || "";

  const { skillCategories, isCategoriesLoading, deleteProfileSkills } =
    useSkills(userId);
  const { skills, isLoading, error } = useMe(userId);

  const handleToggle = (isPressed: boolean, name: string) => {
    if (isPressed) {
      setSelectedSkills((prev) => [...prev, name]);
    } else {
      setSelectedSkills((prev) => prev.filter((skill) => skill !== name));
    }
  };

  const deletePressedSkills = async () => {
    await deleteProfileSkills(selectedSkills);
    setSelectedSkills([]);
  };

  const deleteAllSkills = async () => {
    if (!skills) return;
    await deleteProfileSkills(skills.map((skill) => skill.name));
    setIsOpen(false);
  };

  if (error)
    return <div className="p-4 text-destructive">Error loading skills</div>;
  if (!skills || isLoading || !skillCategories || isCategoriesLoading)
    return <Spinner />;

  // Группируем скиллы пользователя по имеющимся категориям
  const filteredList = skillCategories
    .filter((category) =>
      skills.some((skill) => skill.categoryId === category.id),
    )
    .map((category) => ({
      ...category,
      skills: skills.filter((skill) => skill.categoryId === category.id),
    }));

  return (
    <div className="w-full space-y-6 pt-4">
      {/* Список скиллов, сгруппированный по категориям */}
      <div className="space-y-4">
        {filteredList.map((category) => (
          <div key={`category-${category.id}`} className="space-y-2">
            <h2 className="text-sm font-semibold text-muted-foreground">
              {category.name}
            </h2>
            <ul className="flex flex-wrap gap-2">
              {category.skills.map((skill) => {
                const isSelected = selectedSkills.includes(skill.name);
                return (
                  <li key={`profile-skill-${skill.name}`}>
                    <Toggle
                      variant="ghost"
                      pressed={isSelected}
                      onPressedChange={(pressed) =>
                        handleToggle(pressed, skill.name)
                      }
                    >
                      <SkillBadge
                        variant={isSelected ? "pressed" : skill.mastery}
                      />
                      {skill.name}
                    </Toggle>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Панель кнопок (Добавить / Удалить) */}
      <div className="flex justify-end gap-4 w-full border-t pt-4">
        <SkillsForm userId={userId} />

        {selectedSkills.length > 0 ? (
          <Button variant="primary" onClick={deletePressedSkills}>
            DELETE
            <Badge
              variant="primary"
              className="bg-primary-foreground text-primary font-bold ml-2"
            >
              {selectedSkills.length}
            </Badge>
          </Button>
        ) : (
          <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger
              render={
                <Button
                  variant="ghost"
                  className="text-primary hover:text-primary"
                  disabled={!skills || skills.length <= 0}
                >
                  <Icon variant="delete" />
                  {t("removeSkills")}
                </Button>
              }
            />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will clear list of skills.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={deleteAllSkills}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
};

export default SkillsContent;
