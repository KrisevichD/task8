"use client";

import { useQuery } from "@apollo/client/react";
import Link from "next/link";
import { use, useState } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Icon } from "@/components/ui/icon";
import { EmployeeDetailsContent } from "@/contents/employees/details";
import LanguagesContent from "@/contents/languages"; // 🔑 Импортируем компонент языков
import SkillsContent from "@/contents/skills";
import { useLanguage } from "@/context/language";
import { GET_USER } from "@/graphql/user/queries";

type TabType = "PROFILE" | "SKILLS" | "LANGUAGES";

interface IPageProps {
  params: Promise<{ id: string }>;
}

export default function EmployeeDetailsPage({ params }: IPageProps) {
  const { id } = use(params);
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabType>("PROFILE");

  const {
    data,
    loading: isLoading,
    error,
  } = useQuery(GET_USER, {
    variables: { userId: id },
  });

  const user = data?.user;

  const userName = user?.profile?.first_name
    ? `${user.profile.first_name} ${user.profile.last_name || ""}`.trim()
    : "User";

  if (error) {
    return (
      <div className="p-8 text-center text-destructive">
        Error loading employee details: {error.message}
      </div>
    );
  }

  const tabLabels: Record<TabType, string> = {
    PROFILE: t("profile"),
    SKILLS: t("skills"),
    LANGUAGES: t("languages"),
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
                <span>{isLoading ? `${t("search")}...` : userName}</span>
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center mt-2">
          {(["PROFILE", "SKILLS", "LANGUAGES"] as TabType[]).map((tab) => {
            const isActive = activeTab === tab;

            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
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

      <div className="flex-1 min-h-0 overflow-y-auto pt-4">
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
      </div>
    </div>
  );
}
