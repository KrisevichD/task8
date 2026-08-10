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

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import SkillBadge from "@/components/ui/skill-badge";
import { Spinner } from "@/components/ui/spinner";
import { Toggle } from "@/components/ui/toggle";
import { useLanguage } from "@/context/language";
import { useMe } from "@/hooks/auth/useMe";
import useSkills from "@/hooks/skills/useSkills";

import { IProfileSkill } from "@/types/skills";

const SkillsContent = ({ userId }: { userId?: string }) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const { skillCategories, isCategoriesLoading, deleteProfileSkills } =
    useSkills(userId);
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
    await deleteProfileSkills(selectedSkills.map((skill) => skill.name));
    setSelectedSkills([]);
  };

  const deleteAllSkills = async () => {
    if (!skills) return;
    await deleteProfileSkills(skills?.map((skill) => skill.name));
    setIsOpen(false);
  };

  const cancelEditing = () => {
    setSelectedSkills([]);
  };

  if (error)
    return <div className="p-4 text-destructive">Error loading skills</div>;
  if (!skills || isLoading || !skillCategories || isCategoriesLoading)
    return <Spinner />;

  const filteredList = skillCategories
    .filter((category) =>
      skills.some((skill) => skill.categoryId === category.id),
    )
    .map((category) => ({
      ...category,
      skills: skills.filter((skill) => skill.categoryId === category.id),
    }));

  return (
    <>
      {!userId && (
        <Breadcrumb className="ml-11 mt-4">
          <BreadcrumbList>
            <BreadcrumbItem>{t("skills")}</BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      )}
      <div className="ml-6 mr-6.5 xl:ml-42.25 xl:mr-42.75">
        <div className="pl-6 pt-8">
          {filteredList.map((category) => (
            <div key={`category-${category.id}`}>
              <h2 className="font-normal mb-4">{category.name}</h2>
              <ul className="flex flex-wrap mb-8">
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

        <div className="bg-background py-1 flex justify-end gap-4 w-fill sticky bottom-0 max-lg:bottom-15">
          {selectedSkills.length > 1 ? (
            <Button
              variant={"outline"}
              className={"uppercase"}
              onClick={() => setSelectedSkills([])}
            >
              {t("cancel")}
            </Button>
          ) : (
            <SkillsForm
              userId={userId}
              selectedSkills={selectedSkills}
              cancelEditing={cancelEditing}
            />
          )}

          {selectedSkills.length > 0 ? (
            <Button
              variant={"primary"}
              className={"uppercase"}
              onClick={deletePressedSkills}
            >
              {t("delete")}
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
                    className={"text-primary hover:text-primary uppercase"}
                    disabled={!skills || skills.length <= 0}
                  >
                    <Icon variant="delete" />
                    {t("remove") + " " + t("skills")}
                  </Button>
                }
              />
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("alertWarning")}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("alertSkills")}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className={"uppercase"}>
                    {t("cancel")}
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className={"uppercase"}
                    onClick={deleteAllSkills}
                  >
                    {t("continue")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
    </>
  );
};

export default SkillsContent;
