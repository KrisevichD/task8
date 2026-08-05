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

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import SkillBadge from "@/components/ui/skill-badge";
import { Spinner } from "@/components/ui/spinner";
import { Toggle } from "@/components/ui/toggle";
import useCvConstructor from "@/hooks/cvs/useCvConstructor";
import useSkills from "@/hooks/skills/useSkills";
import { IProfileSkill } from "@/types/skills";
import SkillsForm from "@/components/skills-form";

const CvSkills = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { skillCategories } = useSkills();
  const { cvData, deleteCvSkill } = useCvConstructor();
  const [selectedSkills, setSelectedSkills] = useState<IProfileSkill[]>([]);
  const skills = cvData?.cv.skills;

  const handleToggle = (isPressed: boolean, skill: IProfileSkill) => {
    if (isPressed) {
      setSelectedSkills((prev) => [...prev, skill]);
    } else {
      const selected = selectedSkills.filter((e) => e.name !== skill.name);
      setSelectedSkills(selected);
    }
  };

  const deletePressedSkills = async () => {
    await deleteCvSkill(selectedSkills.map(e => e.name));
    setSelectedSkills([]);
  };

  const deleteAllSkills = async () => {
    if (!skills) return;
    await deleteCvSkill(skills.map((skill) => skill.name));
    setIsOpen(false);
  };

  if (!skills || !skillCategories) return <Spinner />;

  const filteredList = skillCategories
    .filter((category) =>
      skills.some((skill) => skill.categoryId === category.id),
    )
    .map((category) => ({
      ...category,
      skills: skills.filter((skill) => skill.categoryId === category.id),
    }));

  return (
    <div className="pl-0 xl:pl-6 pt-8 xl:ml-42.25 xl:mr-42.75">
      {filteredList.map((category) => (
        <div key={`category-${category.id}`}>
          <h2 className="font-normal">{category.name}</h2>
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

      <div className="flex justify-end w-fill gap-4">
        {selectedSkills.length === 1
        ?
        <SkillsForm cvId={cvData.cv.id} selectedSkills={selectedSkills} cancelEditing={() => setSelectedSkills([])}/>
        :
        <CvSkillsForm />
        }

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
  );
};

export default CvSkills;
