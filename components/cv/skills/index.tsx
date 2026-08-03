import React, { useState } from "react";

import CvSkillsForm from "./form";

import { useMe } from "@/hooks/auth/useMe";
import { getUserIdFromToken } from "@/utils/jwt";

const CvSkills = () => {
  const [isOpen, setIsOpen] = useState(false);
  const userId = getUserIdFromToken();
  const { skills } = useMe(userId);

  return (
    <div className="pl-6 pt-8 ml-42.25 mr-42.75">
      {/* {filteredList.map((category) => {
        return (
          <>
            <h2 className="text-[16px]">{category.name}</h2>
            {category.list.map((skill) => {
              const isPressed = selectedSkills.includes(skill.name);

              return (
                <Toggle
                  key={"cv-skill-" + skill.id}
                  variant={"ghost"}
                  pressed={isPressed}
                  onPressedChange={(pressed) =>
                    handleToggle(skill.name, pressed)
                  }
                  className="w-71 h-12"
                >
                  <SkillBadge variant={skill.mastery} />
                  {skill.name}
                </Toggle>
              );
            })}
          </>
        );
      })} */}

      <div className="flex justify-end w-fill">
        <CvSkillsForm />

        {/* {selectedSkills.length > 0 ? (
          <Button variant={"primary"} onClick={deletePressedSkills}>
            DELETE
            <Badge className="bg-primary-foreground text-primary font-bold">
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
                  disabled={data.skills.length <= 0}
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
                <AlertDialogAction onClick={clearSkillContext}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )} */}
      </div>
    </div>
  );
};

export default CvSkills;
