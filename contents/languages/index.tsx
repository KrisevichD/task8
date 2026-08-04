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
import { getUserIdFromToken } from "@/utils/jwt";

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
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

  const handleToggle = (isPressed: boolean, name: string) => {
    if (isPressed) {
      setSelectedLanguages((prev) => [...prev, name]);
    } else {
      setSelectedLanguages((prev) => prev.filter((lang) => lang !== name));
    }
  };

  const deletePressedLanguages = async () => {
    await deleteProfileLanguages(selectedLanguages);
    setSelectedLanguages([]);
  };

  const deleteAllLanguages = async () => {
    if (!languages) return;
    await deleteProfileLanguages(languages.map((language) => language.name));
    setIsOpen(false);
  };

  if (error)
    return <div className="p-4 text-destructive">Error loading languages</div>;
  if (!languages || isLoading) return <Spinner />;

  return (
    <div className="w-full space-y-6 pt-4">
      <div className="flex flex-wrap gap-2">
        {languages.map((language) => {
          const isSelected = selectedLanguages.includes(language.name);
          return (
            <Toggle
              key={`profile-language-${language.name}`}
              variant="ghost"
              pressed={isSelected}
              onPressedChange={(pressed) =>
                handleToggle(pressed, language.name)
              }
            >
              <span
                className={
                  language.proficiency
                    ? "text-successful font-bold mr-1"
                    : "text-primary mr-1"
                }
              >
                {language.proficiency}
              </span>
              <span>{language.name}</span>
            </Toggle>
          );
        })}
      </div>

      <div className="flex justify-end gap-4 w-full border-t pt-4">
        <LanguagesForm userId={userId} />

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
