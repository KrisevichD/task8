import CvConstructor from "@/contents/cv-constructor";

interface ICvPageProps {
  params: Promise<{ id: string }>;
}

export default async function CvPage({ params }: ICvPageProps) {
  const { id } = await params;

  return (
    <div className="flex flex-col h-full w-full py-4">
      <CvConstructor cvId={id} />
    </div>
  );
}
