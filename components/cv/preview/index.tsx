import { useCVContext } from "@/context/cv";

const CVPreview = () => {
  const { data } = useCVContext();
  console.log(data);
  return <div>preview</div>;
};

export default CVPreview;
