"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

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
import useCvConstructor from "@/hooks/cvs/useCvConstructor";

const VALID_TABS = ["details", "projects", "skills", "preview"] as const;
const DEFAULT_TAB = "details";
type TTab = (typeof VALID_TABS)[number];

const CvConstructor = ({ cvId }: { cvId?: string }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const tab = searchParams.get("tab") ?? "";
  const activeTab = VALID_TABS.includes(tab as TTab) ? tab : DEFAULT_TAB;
  const { cvData, isCvLoading } = useCvConstructor();

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

  if (isCvLoading) return <Spinner />;

  return (
    <div className="pl-6 pr-6.5">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/cvs" />}>CVs</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          {activeTab === "details" ? (
            <BreadcrumbItem>
              <BreadcrumbPage>
                {cvData?.cv.name || "CV Constructor"}
              </BreadcrumbPage>
            </BreadcrumbItem>
          ) : (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href={pathname} />}>
                  {cvData?.cv.name || "CV"}
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator />

              <BreadcrumbItem>
                <BreadcrumbPage className="capitalize">
                  {activeTab}
                </BreadcrumbPage>
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
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <CvDetailsForm />
        </TabsContent>
        <TabsContent value="projects">
          <CvProjects />
        </TabsContent>
        <TabsContent value="skills">
          <CvSkills />
        </TabsContent>
        <TabsContent value="preview">
          <CvPreview />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CvConstructor;
