"use client";

import Link from "next/link";

import { usePathname, useSearchParams } from "next/navigation";

import CVDetailsForm from "@/components/cv/details-form";
import CVPreview from "@/components/cv/preview";
import CVProjects from "@/components/cv/projects";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CVSkills from "@/components/cv/skills";

const VALID_TABS = ["details", "projects", "skills", "preview"] as const;
const DEFAULT_TAB = "details";
type TTab = (typeof VALID_TABS)[number];

const CVWizard = () => {
  const searchParams = useSearchParams();

  const pathname = usePathname();
  const tab = searchParams.get("tab") ?? "";

  const activeTab = VALID_TABS.includes(tab as TTab) ? tab : DEFAULT_TAB;

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

  return (
    <div className="pl-6 pr-6.5">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href={"/cvs"}>CVs</Link>} />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbPage>{1}</BreadcrumbPage>
          {activeTab !== "details" && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>{activeTab}</BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
      <Tabs
        defaultValue={DEFAULT_TAB}
        value={activeTab}
        onValueChange={handleTabChange}
      >
        <TabsList>
          <TabsTrigger value={"details"}>Details</TabsTrigger>
          <TabsTrigger value={"projects"}>Projects</TabsTrigger>
          <TabsTrigger value={"skills"}>Skills</TabsTrigger>
          <TabsTrigger value={"preview"}>Preview</TabsTrigger>
        </TabsList>
        <TabsContent value={"details"}>
          <CVDetailsForm />
        </TabsContent>
        <TabsContent value={"projects"}>
          <CVProjects />
        </TabsContent>
        <TabsContent value={"skills"}>
          <CVSkills />
        </TabsContent>
        <TabsContent value={"preview"}>
          <CVPreview />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CVWizard;
