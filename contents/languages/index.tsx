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
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Spinner } from "@/components/ui/spinner";
import { Toggle } from "@/components/ui/toggle";
import { useLanguage } from "@/context/language";
import { useMe } from "@/hooks/auth/useMe";
import useLanguages from "@/hooks/languages/useLanguages";
import { IProfileLanguage } from "@/types/languages";
import { getUserIdFromToken } from "@/utils/jwt";
import { cn } from "@/utils/shadcn";

interface ILanguagesContentProps {
  userId?: string;
}

export const LanguagesContent = ({
  userId: customUserId,
}: ILanguagesContentProps) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const userId = customUserId || getUserIdFromToken() || "";

  const { deleteProfileLanguages } = useLanguages(userId);
  const { languages, isLoading, error } = useMe(userId);
  const [selectedLanguages, setSelectedLanguages] = useState<
    IProfileLanguage[]
  >([]);

  const handleToggle = (isPressed: boolean, language: IProfileLanguage) => {
    if (isPressed) {
      setSelectedLanguages((prev) => [...prev, language]);
    } else {
      setSelectedLanguages((prev) =>
        prev.filter((lang) => lang.name !== language.name),
      );
    }
  };

  const deletePressedLanguages = async () => {
    await deleteProfileLanguages(selectedLanguages.map((lang) => lang.name));
    setSelectedLanguages([]);
  };

  const deleteAllLanguages = async () => {
    if (!languages) return;
    await deleteProfileLanguages(languages.map((language) => language.name));
    setIsOpen(false);
  };

  if (error)
    return <div className="p-4 text-destructive">Error loading languages</div>;
  if (!languages || isLoading) return null;

  return (
    <div className="space-y-6 mt-4 ml-6 mr-6.5 xl:ml-42.25 xl:mr-42.75">
      <div className="flex flex-wrap gap-2">
        {languages.map((language) => {
          const isSelected = selectedLanguages.includes(language);
          return (
            <Toggle
              key={`profile-language-${language.name}`}
              variant="ghost"
              className={"group"}
              pressed={isSelected}
              onPressedChange={(pressed) => handleToggle(pressed, language)}
            >
              <span
                className={cn(
                  "font-bold transition-colors",
                  isSelected
                    ? "text-foreground"
                    : language.proficiency === "Native"
                      ? "text-primary"
                      : "text-successful",
                )}
              >
                {language.proficiency}
              </span>
              <span>{language.name}</span>
            </Toggle>
          );
        })}
      </div>

      <div className="flex justify-end gap-4 w-full pt-4">
        {selectedLanguages.length > 1 ? (
          <Button variant={"outline"} onClick={() => setSelectedLanguages([])}>
            CANCEL
          </Button>
        ) : (
          <LanguagesForm
            userId={userId}
            selectedLanguages={selectedLanguages}
            cancelEditing={() => setSelectedLanguages([])}
          />
        )}
        {selectedLanguages.length > 0 ? (
          <Button variant="primary" onClick={deletePressedLanguages}>
            DELETE
            <Badge
              variant="primary"
              className="bg-primary-foreground text-primary font-bold ml-2"
            >
              {selectedLanguages.length}
            </Badge>
          </Button>
        ) : (
          <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger
              render={
                <Button
                  variant="ghost"
                  className="text-primary hover:text-primary"
                  disabled={!languages || languages.length <= 0}
                >
                  <Icon variant="delete" />
                  {t("removeLanguages")}
                </Button>
              }
            />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will clear list of languages.
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
  );
};

export default LanguagesContent;
