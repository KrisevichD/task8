"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import SettingsContent from "@/contents/settings";
import { useLanguage } from "@/context/language";

export default function SettingsPage() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col h-full w-full py-4">
      <div className="shrink-0 pl-11 pr-8 pb-3 space-y-3">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="text-muted-foreground font-normal">
              {t("settings")}
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex-1 min-h-0 pl-11 pr-8">
        <SettingsContent />
      </div>
    </div>
  );
}
