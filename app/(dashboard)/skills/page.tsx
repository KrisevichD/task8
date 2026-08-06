import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import SkillsContent from "@/contents/skills";

export default async function SkillsPage() {
  return (
    <>
      <Breadcrumb className="ml-11 mt-4">
        <BreadcrumbList>
          <BreadcrumbItem>Skills</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <SkillsContent />
    </>
  );
}
