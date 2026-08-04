import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import { useMe } from "@/hooks/auth/useMe";
import useCvConstructor from "@/hooks/cvs/useCvConstructor";
import useExportPdf from "@/hooks/cvs/useExportPdf";
import useSkills from "@/hooks/skills/useSkills";
import { validateProjectDate } from "@/utils/helpers";
import { getUserIdFromToken } from "@/utils/jwt";

const CvPreview = () => {
  const { cvData } = useCvConstructor();
  const userId = getUserIdFromToken();
  const { skillCategories } = useSkills();
  const { fullName, positionName, languages } = useMe(userId);
  const { printRef, handleDownloadPdf } = useExportPdf();

  if (!cvData || !skillCategories) return <Spinner />;

  const data = cvData.cv;
  const skills = data.skills;
  const filteredSkills = skillCategories
    .filter((category) =>
      skills.some((skill) => skill.categoryId === category.id),
    )
    .map((category) => ({
      ...category,
      skills: skills.filter((skill) => skill.categoryId === category.id),
    }));

  return (
    <article
      ref={printRef}
      className="px-12 xl:px-48.25 space-y-8 pt-8 text-[16px] font-normal"
    >
      <header className="flex justify-between">
        <div>
          <h1 className="text-[34px] leading-10.5">{fullName}</h1>
          <p className="uppercase leading-6">{positionName}</p>
        </div>
        <Button
          variant={"outlinePrimary"}
          size={"sm"}
          onClick={() => handleDownloadPdf()}
          data-html2canvas-ignore
        >
          EXPORT PDF
        </Button>
      </header>
      <section className="flex">
        <aside className="w-65 py-4 pr-4">
          <section>
            <h3>Education</h3>
            <p>{data.education}</p>
            <h3>Language proficiency</h3>
            <ul>
              {languages?.map((language) => {
                return (
                  <li
                    key={`languages-${language.name}`}
                  >{`${language.name}, ${language.proficiency}`}</li>
                );
              })}
            </ul>
            <h3>Domains</h3>
            <ul>
              {data.projects.map((project) => (
                <li key={`domain-${project.id}`}>{project.domain}</li>
              ))}
            </ul>
          </section>
        </aside>
        <article className="py-4 pl-6.25 pr-3 border-l border-primary">
          <h2>{data.name}</h2>
          <p>{data.description}</p>
          {filteredSkills.map((category) => {
            return (
              <>
                <h3>{category.name}</h3>
                <p>{category.skills.map((skill) => skill.name).join(", ")}</p>
              </>
            );
          })}
        </article>
      </section>
      <section>
        <h2>Projects</h2>
        {data.projects.map((project) => {
          return (
            <article key={`project-${project.id}`} className="flex">
              <header className="w-65 py-4 pr-4">
                <h3 className="uppercase text-primary">{project.name}</h3>
                <p>{project.description}</p>
              </header>
              <div className="py-4 pl-6.25 pr-3 border-l border-primary">
                <h4>Project roles</h4>
                <p>{positionName}</p>
                <h4>Period</h4>
                <p>{`${validateProjectDate(project.start_date, "preview")} - ${validateProjectDate(project.end_date, "preview")}`}</p>
                <h4>Responsibilities</h4>
                {/* TODO */}
                {project.responsibilities}
                <h4>Enviroment</h4>
                {project.environment.join(", ") + "."}
              </div>
            </article>
          );
        })}
      </section>
      <section>
        <h2>Professional skills</h2>
        {/* <Table>
          <TableHeader>
            <TableRow className="px-4 py-2.5 border-primary">
              <TableHead className="align-top">SKILLS</TableHead>
              <TableHead></TableHead>
              <TableHead className="align-top text-center w-28.5">
                EXPERIENCE <br /> IN YEAR
              </TableHead>
              <TableHead className="align-top text-center w-35">
                LAST USED
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.skills.map((category) => {
              return (
                <TableRow key={`category-${category.name}`}>
                  <TableCell className="text-primary">
                    {category.name}
                  </TableCell>
                  <TableCell>
                    {category.list.map((skill) => (
                      <div key={`skill-${skill.id}`}>{skill.name}</div>
                    ))}
                  </TableCell>
                  <TableCell>2</TableCell>
                  <TableCell>2025</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table> */}
      </section>
    </article>
  );
};

export default CvPreview;
