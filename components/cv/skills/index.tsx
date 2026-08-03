import React, { useState } from "react";

import CvSkillsForm from "./form";
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

import { useMe } from "@/hooks/auth/useMe";
import { getUserIdFromToken } from "@/utils/jwt";
import useCvConstructor from "@/hooks/cvs/useCvConstructor";
import { Spinner } from "@/components/ui/spinner";
import { Toggle } from "@/components/ui/toggle";
import SkillBadge from "@/components/ui/skill-badge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";

const CvSkills = () => {
  const [isOpen, setIsOpen] = useState(false);
  const userId = getUserIdFromToken();
  const { cvData, deleteCvSkill } = useCvConstructor();
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const skills = cvData?.cv.skills;

  const handleToggle = (isPressed: boolean, name: string) => {
    if (isPressed) {
      setSelectedSkills((prev) => [...prev, name]);
    } else {
      const selected = selectedSkills.filter((skill) => skill !== name);
      setSelectedSkills(selected);
    }
  };

  const deletePressedSkills = async () => {
    await deleteCvSkill(selectedSkills);
    setSelectedSkills([]);
  };

  const deleteAllSkills = async () => {
    if (!skills) return;
    await deleteCvSkill(skills.map((skill) => skill.name));
    setIsOpen(false);
  };

  if (!skills) return <Spinner />

  return (
    <div className="pl-6 pt-8 ml-42.25 mr-42.75">
      {skills.map(skill => (
        <Toggle
                key={`profile-skill-${skill.name}`}
                variant={"ghost"}
                pressed={selectedSkills.includes(skill.name)}
                onPressedChange={(pressed) => handleToggle(pressed, skill.name)}
              >
                <SkillBadge variant={selectedSkills.includes(skill.name) ? "pressed" : skill.mastery} />
                {skill.name}
              </Toggle>
      ))}

      <div className="flex justify-end w-fill">
        <CvSkillsForm />

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
  );
};

export default CvSkills;
