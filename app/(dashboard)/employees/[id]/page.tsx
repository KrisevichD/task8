"use client";

import { useQuery } from "@apollo/client/react";
import Link from "next/link";
import { use, useState } from "react";

import { Icon } from "@/components/ui/icon";
import { EmployeeDetailsContent } from "@/contents/employees/details";
import { GET_USER } from "@/graphql/user/queries";

type TabType = "PROFILE" | "SKILLS" | "LANGUAGES";

interface IPageProps {
  params: Promise<{ id: string }>;
}

export default function EmployeeDetailsPage({ params }: IPageProps) {
  const { id } = use(params);
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
        Failed to load employee details: {error.message}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full">
      <div className="shrink-0 pr-8">
        <div className="flex items-center gap-2 text-[16px] leading-6 font-normal tracking-[0.15px]">
          <Link
            href="/employees"
            className="text-muted-foreground hover:text-foreground transition-colors pl-5"
          >
            Employees
          </Link>

          <Icon
            variant="arrow-breadcrumb"
            size="xs"
            className="text-muted-foreground"
          />

          <div className="flex items-center gap-1.5 text-primary">
            <Icon variant="user" size="sm" />
            <span>{isLoading ? "Loading..." : userName}</span>
          </div>
        </div>

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
                <span>{tab}</span>

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
          <div className="p-8 text-center text-muted-foreground">
            Skills for {userName}
          </div>
        )}

        {activeTab === "LANGUAGES" && (
          <div className="p-8 text-center text-muted-foreground">
            Languages for {userName}
          </div>
        )}
      </div>
    </div>
  );
}
