"use client";

import { useQuery } from "@apollo/client/react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { use, useEffect, useState } from "react";

import { toast } from "sonner";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Icon } from "@/components/ui/icon";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { EmployeeDetailsContent } from "@/contents/employees/details";
import LanguagesContent from "@/contents/languages";
import SettingsContent from "@/contents/settings";
import SkillsContent from "@/contents/skills";
import { useLanguage } from "@/context/language";
import { GET_USER } from "@/graphql/user/queries";

type TabType = "PROFILE" | "SKILLS" | "LANGUAGES" | "SETTINGS";
const TABS: TabType[] = ["PROFILE", "SKILLS", "LANGUAGES", "SETTINGS"];
const DEFAULT_TAB: TabType = "PROFILE";

interface IPageProps {
  params: Promise<{ id: string }>;
}

export default function EmployeeDetailsPage({ params }: IPageProps) {
  const { id } = use(params);
  const { t } = useLanguage();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTabParam = searchParams.get("tab")?.toUpperCase() as TabType;
  const initialTab = TABS.includes(currentTabParam)
    ? currentTabParam
    : DEFAULT_TAB;
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const {
    data,
    loading: isLoading,
    error,
  } = useQuery(GET_USER, {
    variables: { userId: id },
  });

  const handleTabChange = (nextTab: TabType) => {
    setActiveTab(nextTab);

    const params = new URLSearchParams(searchParams.toString());
    if (nextTab === DEFAULT_TAB) {
      params.delete("tab");
    } else {
      params.set("tab", nextTab.toLowerCase());
    }

    const newUrl = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;
    window.history.replaceState(null, "", newUrl);
  };

  const user = data?.user;

  const userName = user?.profile?.first_name
    ? `${user.profile.first_name} ${user.profile.last_name || ""}`.trim()
    : "User";

  useEffect(() => {
    if (error) {
      toast.error(`Error loading employee details: ${error.message}`);
    }
  }, [error]);

  const tabLabels: Record<TabType, string> = {
    PROFILE: t("profile"),
    SKILLS: t("skills"),
    LANGUAGES: t("languages"),
    SETTINGS: t("settings"),
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="shrink-0 pr-8">
        <Breadcrumb className="pl-5">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/employees" />}>
                {t("employees")}
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbPage className="flex items-center gap-1.5">
                <Icon variant="user" size="sm" />
                {isLoading ? (
                  <Skeleton className="h-4 w-32 rounded bg-muted animate-pulse" />
                ) : (
                  <span>{userName}</span>
                )}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center mt-2">
          {TABS.map((tab) => {
            const isActive = activeTab === tab;

            return (
              <button
                key={tab}
                type="button"
                onClick={() => handleTabChange(tab)}
                className={`w-37.5 h-12 flex items-center justify-center text-sm font-semibold tracking-[0.4px] uppercase transition-colors relative cursor-pointer ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span>{tabLabels[tab]}</span>

                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto pt-4 flex flex-col">
        {isLoading ? (
          <div className="flex-1 flex justify-center items-center">
            <Spinner />
          </div>
        ) : (
          <>
            {activeTab === "PROFILE" && (
              <EmployeeDetailsContent
                userId={id}
                initialUser={user}
                isLoading={isLoading}
              />
            )}

            {activeTab === "SKILLS" && (
              <div className="px-5">
                <SkillsContent userId={id} />
              </div>
            )}

            {activeTab === "LANGUAGES" && (
              <div className="px-5">
                <LanguagesContent userId={id} />
              </div>
            )}

            {activeTab === "SETTINGS" && (
              <div className="px-5">
                <SettingsContent />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
