"use client";

import Link from "next/link";
import { notFound, usePathname, useSearchParams } from "next/navigation";

import CvDetailsForm from "@/components/cv/details-form";
import CvPreview from "@/components/cv/preview";
import CvProjects from "@/components/cv/projects";
import CvSkills from "@/components/cv/skills";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/context/language";
import useCvConstructor from "@/hooks/cvs/useCvConstructor";

const VALID_TABS = ["details", "projects", "skills", "preview"] as const;
const DEFAULT_TAB = "details";
type TTab = (typeof VALID_TABS)[number];

const CvConstructor = ({ cvId }: { cvId: string }) => {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const tab = searchParams.get("tab") ?? "";
  const activeTab: TTab = VALID_TABS.includes(tab as TTab)
    ? (tab as TTab)
    : DEFAULT_TAB;
  const { cvData, cvError } = useCvConstructor(cvId);

  const handleTabChange = (nextTab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (nextTab === "details") {
      params.delete("tab");
    } else {
      params.set("tab", nextTab);
    }

    const newUrl = `${pathname}?${params.toString()}`;
    window.history.replaceState(null, "", newUrl);
  };

  if (cvError) notFound();
  if (!cvData) return <Spinner />;

  return (
    <div className="px-12 xl:pl-6 xl:pr-6.5 py-4">
      <Breadcrumb className="mb-1">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/cvs" />}>
              {t("cvs")}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{cvData.name || "CV"}</BreadcrumbPage>
          </BreadcrumbItem>
          {activeTab !== "details" && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem className="capitalize">
                {t(activeTab)}
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>

      <Tabs
        defaultValue={DEFAULT_TAB}
        value={activeTab}
        onValueChange={handleTabChange}
      >
        <TabsList className="mb-4">
          <TabsTrigger value="details">{t("details")}</TabsTrigger>
          <TabsTrigger value="skills">{t("skills")}</TabsTrigger>
          <TabsTrigger value="projects">{t("projects")}</TabsTrigger>
          <TabsTrigger value="preview">{t("preview")}</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <CvDetailsForm cvData={cvData} />
        </TabsContent>
        <TabsContent value="projects">
          <CvProjects />
        </TabsContent>
        <TabsContent value="skills">
          <CvSkills cvData={cvData} />
        </TabsContent>
        <TabsContent value="preview">
          <CvPreview cvData={cvData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CvConstructor;
