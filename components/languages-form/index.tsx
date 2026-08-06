import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FloatingSelect } from "@/components/ui/floating-select";
import { Icon } from "@/components/ui/icon";
import { SelectItem } from "@/components/ui/select";
import { useMe } from "@/hooks/auth/useMe";
import useLanguages from "@/hooks/languages/useLanguages";
import { IProfileLanguage, TLanguageProficiency } from "@/types/languages";

const LanguagesForm = ({
  userId,
  selectedLanguages,
  cancelEditing,
}: {
  userId: string;
  selectedLanguages: IProfileLanguage[];
  cancelEditing: () => void;
}) => {
  const isEditing = selectedLanguages.length === 1;
  const action = isEditing ? "Update" : "Add";
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<string>("");
  const [languageProficiency, setLanguageProficiency] =
    useState<TLanguageProficiency>(
      isEditing ? selectedLanguages[0].proficiency : "A1",
    );
  const { languages: profileLanguages } = useMe(userId);
  const {
    getAllLanguages,
    languages,
    isLanguagesLoading,
    addProfileLanguage,
    updateProfileLanguage,
    isAddingLoading,
  } = useLanguages(userId);

  useEffect(() => {
    if (isOpen) {
      getAllLanguages();
    }
  }, [isOpen, getAllLanguages]);

  const onSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = {
      name: isEditing ? selectedLanguages[0].name : language,
      proficiency: languageProficiency,
    };
    if (isEditing) {
      await updateProfileLanguage(data);
    } else {
      await addProfileLanguage(data);
    }
    setIsOpen(false);
    cancelEditing();
  };

  const handleOpen = (open: boolean) => {
    setIsOpen(open);
    if (isEditing) setLanguageProficiency(selectedLanguages[0].proficiency);
  };

  const filteredLanguages = languages?.languages.filter(
    (lang) =>
      !profileLanguages?.some((profileLang) => profileLang.name === lang.name),
  );

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleOpen}>
        <DialogTrigger
          render={
            <Button variant={"ghost"} className={"uppercase"}>
              <Icon variant="add" />
              {action} LANGUAGE
            </Button>
          }
        />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{action} language</DialogTitle>
          </DialogHeader>
          <form id="language-form" className="space-y-8" onSubmit={onSubmit}>
            <FloatingSelect
              label="Language"
              value={isEditing ? selectedLanguages[0].name : language}
              onValueChange={(value) => setLanguage(value as string)}
              disabled={isLanguagesLoading || isAddingLoading || isEditing}
            >
              {filteredLanguages?.map((language) => {
                return (
                  <SelectItem
                    key={`select-language-${language.name}`}
                    value={language.name}
                  >
                    {language.name}
                  </SelectItem>
                );
              })}
            </FloatingSelect>

            <FloatingSelect
              label="Language proficiency"
              value={languageProficiency}
              onValueChange={(value) =>
                setLanguageProficiency(value as TLanguageProficiency)
              }
              disabled={isLanguagesLoading || isAddingLoading}
            >
              <SelectItem value={"A1"}>A1</SelectItem>
              <SelectItem value={"A2"}>A2</SelectItem>
              <SelectItem value={"B1"}>B1</SelectItem>
              <SelectItem value={"B2"}>B2</SelectItem>
              <SelectItem value={"C1"}>C1</SelectItem>
              <SelectItem value={"C2"}>C2</SelectItem>
              <SelectItem value={"Native"}>Native</SelectItem>
            </FloatingSelect>
          </form>
          <DialogFooter>
            <DialogClose render={<Button variant={"outline"}>CANCEL</Button>} />
            <Button
              variant={"primary"}
              type="submit"
              disabled={isLanguagesLoading || isAddingLoading}
              form="language-form"
              className={"uppercase"}
            >
              {action}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LanguagesForm;
