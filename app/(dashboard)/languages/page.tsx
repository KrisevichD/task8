import { Breadcrumb, BreadcrumbItem, BreadcrumbList } from "@/components/ui/breadcrumb";
import LanguagesContent from "@/contents/languages";

export default async function LanguagesPage() {
  return (
    <>
    <Breadcrumb className="ml-11 mt-4">
        <BreadcrumbList>
          <BreadcrumbItem>Languages</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <LanguagesContent />
    </>
  );
}
