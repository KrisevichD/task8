import { useEffect, useState } from "react";

import { toast } from "sonner";

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
  const { t } = useLanguage();
  const languageProficiencySelectItems = [
    { value: "A1", label: "A1" },
    { value: "A2", label: "A2" },
    { value: "B1", label: "B1" },
    { value: "B2", label: "B2" },
    { value: "C1", label: "C1" },
    { value: "C2", label: "C2" },
    { value: "Native", label: t("native") },
  ];
  const isEditing = selectedLanguages.length === 1;
  const action = isEditing ? t("update") : t("add");
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<string>("");
  const [languageProficiency, setLanguageProficiency] =
    useState<TLanguageProficiency>("A1");
  const {
    getAllLanguages,
    filteredLanguages,
    isLanguagesLoading,
    addProfileLanguage,
    updateProfileLanguage,
  } = useLanguages(userId);

  const [prevSelectedLanguage, setPrevSelectedLanguage] = useState<
    string | null
  >(null);
  const currentSelectedLanguage = isEditing ? selectedLanguages[0].name : null;
  if (prevSelectedLanguage !== currentSelectedLanguage) {
    setPrevSelectedLanguage(currentSelectedLanguage);
    setLanguageProficiency(isEditing ? selectedLanguages[0].proficiency : "A1");
  }

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
    if (!data.name) {
      toast.error(t("toastErrorLanguage"), { position: "top-right" });
      return;
    }
    setIsOpen(false);
    if (isEditing) {
      await updateProfileLanguage(data);
    } else {
      await addProfileLanguage(data);
    }
    cancelEditing();
  };

  const handleOpen = (open: boolean) => {
    setIsOpen(open);
    if (isEditing) setLanguageProficiency(selectedLanguages[0].proficiency);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleOpen}>
        <DialogTrigger
          render={
            <Button variant={"ghost"} className={"uppercase"}>
              {!isEditing && <Icon variant="add" />}
              {action} {t("language")}
            </Button>
          }
        />
        <DialogContent>
          <DialogHeader>
            <DialogTitle className={"sentence-case"}>
              {action} {t("language")}
            </DialogTitle>
          </DialogHeader>
          <form id="language-form" className="space-y-8" onSubmit={onSubmit}>
            <FloatingSelect
              label={t("language")}
              value={isEditing ? selectedLanguages[0].name : language}
              onValueChange={(value) => setLanguage(value as string)}
              disabled={isLanguagesLoading || isEditing}
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
              items={languageProficiencySelectItems}
              label={t("languageProficiency")}
              value={languageProficiency}
              onValueChange={(value) =>
                setLanguageProficiency(value as TLanguageProficiency)
              }
              disabled={isLanguagesLoading}
            >
              {languageProficiencySelectItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </FloatingSelect>
          </form>
          <DialogFooter>
            <DialogClose
              render={
                <Button variant={"outline"} className={"uppercase"}>
                  {t("cancel")}
                </Button>
              }
            />
            <Button
              variant={"primary"}
              type="submit"
              disabled={isLanguagesLoading}
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
