"use client";

import { useQuery } from "@apollo/client/react";
import { useState } from "react";

import { CvTable } from "./table";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { SearchInput } from "@/components/ui/search-input";
import { Spinner } from "@/components/ui/spinner";
import { useLanguage } from "@/context/language";
import { CREATE_CV_MUTATION } from "@/graphql/cvs";
import { GET_CVS, ICv } from "@/graphql/cvs/queries";
import useCreateCv from "@/hooks/cvs/useCreateCv";
import { useDeleteCv } from "@/hooks/cvs/useDeleteCv";

const CvsContent = () => {
  const [search, setSearch] = useState("");
  const { deleteCv } = useDeleteCv();
  const handleDeleteCv = async (cv: ICv) => {
    deleteCv(cv.id);
  };
  const { data, loading: isLoadingCvs, error } = useQuery(GET_CVS);
  const { createCv, isLoading: isCreating } = useCreateCv(CREATE_CV_MUTATION);
  const { t } = useLanguage();

  const cvs = data?.cvs || [];

  const handleCreateCv = async () => {
    await createCv({
      cv: {
        userId: "610",
        name: "CV",
        description: "CV description",
        education: "CV education",
      },
    });
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

          <Button
            variant="ghost"
            onClick={handleCreateCv}
            disabled={isCreating}
            className="text-primary hover:text-primary/80 font-semibold gap-1.5 uppercase tracking-wide cursor-pointer"
          >
            <Icon variant="add" />
            {t("createCv")}
          </Button>
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
