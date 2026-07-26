import CVWizard from "@/contents/cv-wizard";
import CVProvider from "@/context/cv";

export default async function CvPage() {
  return (
    <>
      <CVProvider>
        <CVWizard />
      </CVProvider>
    </>
  );
}
