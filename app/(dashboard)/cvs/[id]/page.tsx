import CvConstructor from "@/contents/cv-constructor";

interface ICvPageProps {
  params: Promise<{ id: string }>;
}

export default async function CvPage({ params }: ICvPageProps) {
  const { id } = await params;

  return (
    <>
      <CvConstructor cvId={id} />
    </>
  );
}
