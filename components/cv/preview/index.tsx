import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { useMe } from "@/hooks/auth/useMe";
import useCvConstructor from "@/hooks/cvs/useCvConstructor";
import useExportPdf from "@/hooks/cvs/useExportPdf";
import useSkills from "@/hooks/skills/useSkills";
import { ICvResponce } from "@/types/cv-constructor";
import { validateProjectDate } from "@/utils/helpers";
import { getUserIdFromToken } from "@/utils/jwt";
import React from "react";

const CvPreview = ({ cvData }: { cvData: ICvResponce }) => {
  const userId = cvData.user.id;
  const { skillCategories } = useSkills();
  const { fullName, positionName, languages } = useMe(userId);
  const { printRef, handleDownloadPdf } = useExportPdf();

  if (!cvData || !skillCategories) return <Spinner />;

  const skills = cvData.skills;
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
      className="px-0 xl:px-48.25 space-y-8 pt-8 text-[16px] font-normal"
    >
      <header className="flex justify-between">
        <div>
          <h1 className="text-[34px] leading-10.5">{fullName}</h1>
          <p className="uppercase leading-6">{positionName}</p>
        </div>
        <Button
          id="export-pdf-btn"
          variant={"outlinePrimary"}
          size={"sm"}
          onClick={() => handleDownloadPdf()}
          data-html2canvas-ignore
        >
          EXPORT PDF
        </Button>
      </header>
      <section className="flex">
        <aside>
          <section className="w-65 py-4 pr-4">
            <h3>Education</h3>
            <p>{cvData.education}</p>
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
              {cvData.projects.map((project) => (
                <li key={`domain-${project.id}`}>{project.domain}</li>
              ))}
            </ul>
          </section>
        </aside>
        <article className="py-4 pl-6.25 pr-3 border-l border-primary">
          <h2>{cvData.name}</h2>
          <p>{cvData.description}</p>
          {filteredSkills.map((category) => {
            return (
              <React.Fragment key={`category-skill-${category.id}`}>
                <h3>{category.name}</h3>
                <p>{category.skills.map((skill) => skill.name).join(", ")}</p>
              </React.Fragment>
            );
          })}
        </article>
      </section>
      <section>
        <h2 className="text-[34px] font-normal tracking-wide my-7.5">Projects</h2>
        {cvData.projects.map((project) => {
          return (
            <article key={`project-${project.id}`} className="flex">
              <header className="w-65 min-w-65 py-4 pr-4">
                <h3 className="uppercase text-primary">{project.name}</h3>
                <p>{project.description}</p>
              </header>
              <div className="py-4 pl-6.25 pr-3 border-l border-primary">
                <h4>Project roles</h4>
                <p>{positionName}</p>
                <h4>Period</h4>
                <p>{`${validateProjectDate(project.start_date, "preview")} - ${validateProjectDate(project.end_date, "preview")}`}</p>
                <h4>Responsibilities</h4>
                <ul>
                {project.responsibilities.map((responcibility, index) => (
                  <li key={`responcibility-${index}`} className="list-disc list-inside">{responcibility}</li>
                ))}
                </ul>
                <h4>Enviroment</h4>
                {project.environment.join(", ") + "."}
              </div>
            </article>
          );
        })}
      </section>
      <section>
        <h2 className="text-[34px] font-normal tracking-wide my-7.5">Professional skills</h2>
        <Table className="text-[14px]">
          <TableHeader>
            <TableRow className=" border-primary font-medium">
              <TableHead className="align-top px-4 py-2.5">SKILLS</TableHead>
              <TableHead></TableHead>
              <TableHead className="align-top px-4 py-2.5 text-center w-28.5">
                EXPERIENCE <br /> IN YEAR
              </TableHead>
              <TableHead className="align-top px-4 py-2.5 text-center w-35">
                LAST USED
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSkills.map((category) => {
              return (
                <TableRow key={`category-${category.name}`} className="p-2.5">
                  <TableCell className="align-top px-4 py-2.5 text-primary">
                    {category.name}
                  </TableCell>
                  <TableCell className="space-y-5 pb-7 px-4 pt-2.5">
                    {category.skills.map((skill) => (
                      <p key={`skill-${skill.name}`}>{skill.name}</p>
                    ))}
                  </TableCell>
                  <TableCell className="align-top px-4 py-2.5 text-center">2</TableCell>
                  <TableCell className="align-top px-4 py-2.5 text-center">2025</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </section>
    </article>
  );
};

export default CvPreview;
