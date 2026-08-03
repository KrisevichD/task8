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
import { useMe } from "@/hooks/auth/useMe";
import useSkills from "@/hooks/skills/useSkills";

import { getUserIdFromToken } from "@/utils/jwt";

const SkillsContent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const userId = getUserIdFromToken();
  const { deleteProfileSkills } = useSkills();
  const { skills, isLoading, error } = useMe(userId);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const handleToggle = (isPressed: boolean, name: string) => {
    if (isPressed) {
      setSelectedSkills((prev) => [...prev, name]);
    } else {
      const selected = selectedSkills.filter((skill) => skill !== name);
      setSelectedSkills(selected);
    }
  };

  const deletePressedSkills = async () => {
    await deleteProfileSkills(selectedSkills);
    setSelectedSkills([]);
  };

  const deleteAllSkills = async () => {
    if (!skills) return;
    await deleteProfileSkills(skills?.map((skill) => skill.name));
    setIsOpen(false);
  };

  if (error) return <>Error</>;
  if (!skills || isLoading) return <Spinner />;

  return (
    <>
      
      <div className="ml-6 mr-6.5 lg:ml-42.25 lg:mr-42.75">
        <div className="pl-6 pt-8 flex flex-wrap">
          {skills?.map((skill) => {
            return (
              <Toggle
                key={`profile-skill-${skill.name}`}
                variant={"ghost"}
                pressed={selectedSkills.includes(skill.name)}
                onPressedChange={(pressed) => handleToggle(pressed, skill.name)}
              >
                <SkillBadge variant={skill.mastery} />
                {skill.name}
              </Toggle>
            );
          })}
        </div>

        <div className="flex justify-end gap-4 w-fill">
          <SkillsForm />

          {selectedSkills.length > 0 ? (
            <Button variant={"primary"} onClick={deletePressedSkills}>
              DELETE
              <Badge variant={'primary'} className="bg-primary-foreground text-primary font-bold">
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
    </>
  );
};

export default SkillsContent;
