import React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/ui/icon";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useCvConstructor from "@/hooks/cvs/useCvConstructor";
import { validateProjectDate } from "@/utils/helpers";
import CvProjectsForm from "../form";

const CvProjectsList = () => {
  const { cvData, deleteCvProject } = useCvConstructor();

  const handleDeleteProject = (id: string) => {
    deleteCvProject({
        cvId: cvData!.cv.id,
        projectId: id
    })
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Domain</TableHead>
          <TableHead>Start Date</TableHead>
          <TableHead>End Date</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cvData?.cv.projects?.map((project) => {
          return (
            <TableRow
              key={`cv-projects-${project.id}`}
              className="last:border-b-0"
            >
              <TableCell className="max-w-89 space-y-4 pt-7">
                <p>{project.name}</p>
                <p className="w-[calc(100vw-280px)] opacity-50 whitespace-normal wrap-break-word">
                  {project.description}
                </p>
                <div className="w-[calc(100vw-280px)] flex flex-wrap gap-2">
                  {project.responsibilities.length > 0 &&
                    project.responsibilities.map((tag) => {
                      return <Badge key={`tag-${tag}`}>{tag}</Badge>;
                    })}
                </div>
              </TableCell>
              <TableCell className="align-top h-18 pt-7">
                {project.domain}
              </TableCell>
              <TableCell className="align-top h-18 pt-7">
                {validateProjectDate(project.start_date, "cv-projects")}
              </TableCell>
              <TableCell className="align-top h-18 pt-7">
                {validateProjectDate(project.end_date, "cv-projects")}
              </TableCell>
              <TableCell className="align-top h-18 pt-4">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button variant={"ghost"} size={"icon"}>
                        <Icon variant="dots" label="Open settings" />
                      </Button>
                    }
                  />
                  <DropdownMenuContent>
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        <CvProjectsForm initialData={{
                            name: project.name,
                            domain: project.domain,
                            start_date: project.start_date,
                            end_date: project.end_date,
                            description: project.description,
                            environment: project.environment,
                            responsibilities: project.responsibilities.join('\n'),
                        }}/>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem variant="destructive"  onClick={() => handleDeleteProject(project.id)}>
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default CvProjectsList;
