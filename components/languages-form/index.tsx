"use client";

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
import { useLanguage } from "@/context/language";
import useLanguages from "@/hooks/languages/useLanguages";
import { TLanguageProficiency } from "@/types/languages";

interface ILanguagesFormProps {
  userId: string;
}

const LanguagesForm = ({ userId }: ILanguagesFormProps) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<string>("");
  const [languageProficiency, setLanguageProficiency] =
    useState<TLanguageProficiency>("A1");

  const {
    getAllLanguages,
    languages,
    isLanguagesLoading,
    addProfileLanguage,
    isAddingLoading,
  } = useLanguages(userId);

  useEffect(() => {
    if (isOpen) {
      getAllLanguages();
    }
  }, [isOpen, getAllLanguages]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!language) return;
    const data = {
      name: language,
      proficiency: languageProficiency,
    };
    await addProfileLanguage(data);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        render={
          <Button variant="ghost">
            <Icon variant="add" />
            {t("addLanguage")}
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("addLanguage")}</DialogTitle>
        </DialogHeader>
        <form id="language-form" className="space-y-8" onSubmit={onSubmit}>
          <FloatingSelect
            label="Language"
            value={language}
            onValueChange={(value) => setLanguage(value as string)}
            disabled={isLanguagesLoading || isAddingLoading}
          >
            {languages?.languages.map((item) => (
              <SelectItem
                key={`select-language-${item.name}`}
                value={item.name}
              >
                {item.name}
              </SelectItem>
            ))}
          </FloatingSelect>

          <FloatingSelect
            label="Language proficiency"
            value={languageProficiency}
            onValueChange={(value) =>
              setLanguageProficiency(value as TLanguageProficiency)
            }
            disabled={isLanguagesLoading || isAddingLoading}
          >
            <SelectItem value="A1">A1</SelectItem>
            <SelectItem value="A2">A2</SelectItem>
            <SelectItem value="B1">B1</SelectItem>
            <SelectItem value="B2">B2</SelectItem>
            <SelectItem value="B2">B2</SelectItem>
            <SelectItem value="C1">C1</SelectItem>
            <SelectItem value="C2">C2</SelectItem>
            <SelectItem value="Native">Native</SelectItem>
          </FloatingSelect>
        </form>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">CANCEL</Button>} />
          <Button
            variant="primary"
            type="submit"
            disabled={isLanguagesLoading || isAddingLoading}
            form="language-form"
          >
            ADD
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LanguagesForm;
