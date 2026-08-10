"use client";

import { useQuery } from "@apollo/client/react";
import { useState } from "react";

import { useForm } from "react-hook-form";

import { toast } from "sonner";

import { CvTable } from "./table";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FloatingInput } from "@/components/ui/floating-input";
import { FloatingTextarea } from "@/components/ui/floating-textarea";
import { Icon } from "@/components/ui/icon";
import { SearchInput } from "@/components/ui/search-input";
import { Spinner } from "@/components/ui/spinner";
import { useLanguage } from "@/context/language";
import { CREATE_CV_MUTATION } from "@/graphql/cvs";
import { GET_CVS, ICv } from "@/graphql/cvs/queries";
import useCreateCv from "@/hooks/cvs/useCreateCv";
import { useDeleteCv } from "@/hooks/cvs/useDeleteCv";
import { ICreateCvInput } from "@/types/cvs";

const CvsContent = () => {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const { deleteCv } = useDeleteCv();
  const { data, loading: isLoadingCvs, error } = useQuery(GET_CVS);
  const { createCv, isLoading: isCreating } = useCreateCv(CREATE_CV_MUTATION);
  const [isOpen, setIsOpen] = useState(false);
  const cvs = data?.cvs || [];
  const { handleSubmit, reset, register } = useForm({
    defaultValues: {
      name: "",
      education: "",
      description: "",
    },
  });

  const handleDeleteCv = async (cv: ICv) => {
    deleteCv(cv.id);
  };

  const onSubmit = (formData: Omit<ICreateCvInput, "userId">) => {
    setIsOpen(false);
    reset();
    createCv(formData);
  };

  const onValidationError = (errors: any) => {
    const firstErrorField = Object.keys(errors)[0];
    const errorMessage =
      errors[firstErrorField]?.message || "Please fill in all required fields";
    toast.error(errorMessage, { position: "top-right" });
  };

  const filteredCvs = cvs.filter(
    (item) =>
      item.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.education?.toLowerCase().includes(search.toLowerCase()) ||
      item.user?.email?.toLowerCase().includes(search.toLowerCase()),
  );

  if (error) {
    return (
      <div className="p-8 text-center text-destructive">
        Error loading CVs: {error.message}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full pt-4 relative">
      <div className="shrink-0 space-y-3 pb-3">
        <div className="pl-11">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="text-muted-foreground font-normal">
                {t("cvs")}
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex items-center justify-between pl-5">
          <SearchInput value={search} onChange={setSearch} />

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger
              render={
                <Button
                  variant="ghost"
                  disabled={isCreating}
                  className="text-primary hover:text-primary/80 font-semibold gap-1.5 uppercase tracking-wide cursor-pointer"
                >
                  <Icon variant="add" />
                  {t("createCv")}
                </Button>
              }
            />
            <DialogContent>
              <DialogTitle className={"sentence-case"}>
                {t("add")} CV
              </DialogTitle>
              <form
                id="cv-create-form"
                className="space-y-4"
                onSubmit={handleSubmit(onSubmit, onValidationError)}
              >
                <FloatingInput
                  label={t("name")}
                  {...register("name", {
                    required: `${t("name")}${t("isRequired")}`,
                  })}
                  disabled={isCreating}
                />
                <FloatingInput
                  label={t("education")}
                  {...register("education", {
                    required: `${t("education")}${t("isRequired")}`,
                  })}
                  disabled={isCreating}
                />
                <FloatingTextarea
                  label={t("description")}
                  {...register("description", {
                    required: `${t("description")}${t("isRequired")}`,
                  })}
                  disabled={isCreating}
                />
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
                  disabled={isCreating}
                  form="cv-create-form"
                  className={"uppercase"}
                >
                  {t("add")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        {isLoadingCvs ? (
          <div className="fixed inset-0 left-0 lg:left-50 flex items-center justify-center pointer-events-none">
            <Spinner />
          </div>
        ) : (
          <CvTable items={filteredCvs} onDelete={handleDeleteCv} />
        )}
      </div>
    </div>
  );
};

export default CvsContent;
