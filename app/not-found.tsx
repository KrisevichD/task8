"use client";

import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { useLanguage } from "@/context/language";
import { cn } from "@/utils/shadcn";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-background text-foreground space-y-6">
      <h1 className="text-9xl font-extrabold tracking-widest text-primary">
        404
      </h1>
      <div className="bg-primary/20 text-primary px-3 py-1 text-sm rounded rotate-12 absolute">
        Page Not Found
      </div>
      <p className="text-muted-foreground text-lg text-center max-w-md">
        {t("language") === "Язык"
          ? "Упс! Страница, которую вы ищете, не существует или была перемещена."
          : "Oops! The page you are looking for does not exist or has been moved."}
      </p>
      <Link
        href="/employees"
        className={cn(
          buttonVariants({ variant: "default" }),
          "mt-4 uppercase font-semibold",
        )}
      >
        {t("employees")}
      </Link>
    </div>
  );
}
