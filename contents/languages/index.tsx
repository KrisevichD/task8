"use client";

import { useState } from "react";

import LanguagesForm from "@/components/languages-form";
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
import { Spinner } from "@/components/ui/spinner";
import { Toggle } from "@/components/ui/toggle";

import { useMe } from "@/hooks/auth/useMe";
import useLanguages from "@/hooks/languages/useLanguages";
import { getUserIdFromToken } from "@/utils/jwt";

const SkillsContent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const userId = getUserIdFromToken();
  const { deleteProfileLanguages } = useLanguages();
  const { languages, isLoading, error } = useMe(userId);
  const [selectedLangueages, setSelectedLanguages] = useState<string[]>([]);

  const handleToggle = (isPressed: boolean, name: string) => {
    if (isPressed) {
      setSelectedLanguages((prev) => [...prev, name]);
    } else {
      const selected = selectedLangueages.filter(
        (language) => language !== name,
      );
      setSelectedLanguages(selected);
    }
  };

  const deletePressedLanguages = async () => {
    await deleteProfileLanguages(selectedLangueages);
    setSelectedLanguages([]);
  };

  const deleteAllLanguages = async () => {
    if (!languages) return;
    await deleteProfileLanguages(languages?.map((language) => language.name));
    setIsOpen(false);
  };

  if (error) return <>Error</>;
  if (!languages || isLoading) return <Spinner />;

  return (
    <>
      <div className="ml-6 mr-6.5 lg:ml-42.25 lg:mr-42.75">
        <div className="pl-6 pt-8 flex flex-wrap">
          {languages?.map((language) => {
            return (
              <Toggle
                key={`profile-skill-${language.name}`}
                variant={"ghost"}
                pressed={selectedLangueages.includes(language.name)}
                onPressedChange={(pressed) =>
                  handleToggle(pressed, language.name)
                }
              >
                <span className={language.proficiency ? "text-successful" : "text-primary"}>{language.proficiency}</span>
                <span className="">{language.name}</span>
              </Toggle>
            );
          })}
        </div>

        <div className="flex justify-end gap-4 w-fill">
          <LanguagesForm />

          {selectedLangueages.length > 0 ? (
            <Button variant={"primary"} onClick={deletePressedLanguages}>
              DELETE
              <Badge variant={'primary'} className="bg-primary-foreground text-primary font-bold">
                {selectedLangueages.length}
              </Badge>
            </Button>
          ) : (
            <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
              <AlertDialogTrigger
                render={
                  <Button
                    variant={"ghost"}
                    className={"text-primary hover:text-primary"}
                    disabled={!languages || languages.length <= 0}
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
                  <AlertDialogAction onClick={deleteAllLanguages}>
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
