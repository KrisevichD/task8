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
import { IProfileSkill } from "@/types/skills";

interface ISkillsContentProps {
  userId?: string;
}

export const SkillsContent = ({
  userId: customUserId,
}: ISkillsContentProps) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const userId = customUserId || getUserIdFromToken() || "";
  const { skillCategories, isCategoriesLoading, deleteProfileSkills } =
    useSkills();
  const { skills, isLoading, error } = useMe(userId);
  const [selectedSkills, setSelectedSkills] = useState<IProfileSkill[]>([]);

  const handleToggle = (isPressed: boolean, skill: IProfileSkill) => {
    if (isPressed) {
      setSelectedSkills((prev) => [...prev, skill]);
    } else {
      const selected = selectedSkills.filter((e) => e.name !== skill.name);
      setSelectedSkills(selected);
    }
  };

  const deletePressedSkills = async () => {
    await deleteProfileSkills(selectedSkills.map(skill => skill.name));
    setSelectedSkills([]);
  };

  const deleteAllSkills = async () => {
    if (!skills) return;
    await deleteProfileSkills(skills?.map(skill => skill.name));
    setIsOpen(false);
  };

  const cancelEditing = () => {
    setSelectedSkills([]);
  }

  if (error) return <>Error</>;
  if (!skills || isLoading || !skillCategories || isCategoriesLoading)
    return <Spinner />;

  // Группируем скиллы пользователя по имеющимся категориям
  const filteredList = skillCategories
    .filter((category) =>
      skills.some((skill) => skill.categoryId === category.id),
    )
    .map((category) => ({
      ...category,
      skills: skills.filter(skill => skill.categoryId === category.id),
    }));

  return (
    <>
      <div className="ml-6 mr-6.5 xl:ml-42.25 xl:mr-42.75">
        <div className="pl-6 pt-8">
          {filteredList.map((category) => (
            <div key={`category-${category.id}`}>
              <h2 className="font-normal mt-8 mb-4">{category.name}</h2>
              <ul className="flex flex-wrap">
                {category.skills.map((skill) => {
                  return (
                    <li key={`profile-skill-${skill.name}`}>
                      <Toggle
                        variant={"ghost"}
                        pressed={selectedSkills.includes(skill)}
                        onPressedChange={(pressed) =>
                          handleToggle(pressed, skill)
                        }
                      >
                        <SkillBadge
                          variant={
                            selectedSkills.includes(skill)
                              ? "pressed"
                              : skill.mastery
                          }
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

        <div className="flex justify-end gap-4 w-fill sticky bottom-1">
          <SkillsForm selectedSkills={selectedSkills} cancelEditing={cancelEditing} />

          {selectedSkills.length > 0 ? (
            <Button variant={"primary"} onClick={deletePressedSkills}>
              DELETE
              <Badge
                variant={"primary"}
                className="bg-primary-foreground text-primary font-bold"
              >
                {selectedSkills.length}
              </Badge>
            </Button>
          ) : (
            <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
              <AlertDialogTrigger
                render={
                  <Button
                    variant={"ghost"}
                    className={"text-primary hover:text-primary"}
                    disabled={!skills || skills.length <= 0}
                  >
                    <Icon variant="delete" />
                    REMOVE SKILLS
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

      {/* Панель кнопок (Добавить / Удалить) */}
      <div className="flex justify-end gap-4 w-full border-t pt-4">
        <SkillsForm userId={userId} cancelEditing={cancelEditing} selectedSkills={selectedSkills} />

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
    </>
  );
};

export default SkillsContent;
