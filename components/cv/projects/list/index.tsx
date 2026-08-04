import React, { useState } from "react";

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
import { Spinner } from "@/components/ui/spinner";
import { useLazyQuery } from "@apollo/client/react";
import { GET_ALL_PROJECTS } from "@/graphql/cv-constructor";
import { ICvProject } from "@/types/cv-constructor";

const CvProjectsList = ({ searchQuery }: { searchQuery?: string }) => {
  const { cvData, deleteCvProject } = useCvConstructor();
  const [isEditing, setIsEditing] = useState(false);
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null)

  const handleDeleteProject = async (project: ICvProject) => {
    deleteCvProject({
        cvId: cvData!.cv.id,
        project: project
    });
    
  }

  if (!cvData) return <Spinner />

  const projects = cvData.cv.projects;
  const filteredList = !searchQuery ? projects : projects.filter(project => {
    const lowerQuery = searchQuery.trim().toLowerCase();
    const matchesName = project.name.toLowerCase().includes(lowerQuery);
    const matchesDomain = project.domain.toLowerCase().includes(lowerQuery);
    const matchesDescription = project.description.toLowerCase().includes(lowerQuery);
    const matchesResponsibilities = project.responsibilities.join(" ").toLowerCase().includes(lowerQuery);

    return matchesName || matchesDomain || matchesDescription || matchesResponsibilities;
  } )

  if (filteredList.length === 0 && !!searchQuery) return <div className="w-full text-xl text-primary text-center">No matches found</div>

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
        {filteredList.map((project) => {
          const isCurrentHovered = project.id === hoveredProjectId;
          return (
            <React.Fragment key={`cv-projects-${project.id}`}>
            <TableRow
              className={(isCurrentHovered ? "bg-muted/50" : "bg-background") + " border-b-0"}
              onMouseEnter={() => setHoveredProjectId(project.id)}
              onMouseLeave={() => setHoveredProjectId(null)}
            >
              <TableCell className="max-w-89 pt-7 align-top w-[30%]">
                <p className="align-top">{project.name}</p>
                
              </TableCell>
              <TableCell className="align-top h-18 pt-7 w-[30%]">
                {project.domain}
              </TableCell>
              <TableCell className="align-top h-18 pt-7 w-[15%]">
                {validateProjectDate(project.start_date, "cv-projects")}
              </TableCell>
              <TableCell className="align-top h-18 pt-7 w-[15%]">
                {validateProjectDate(project.end_date, "cv-projects")}
              </TableCell>
              <TableCell className="align-top h-18 pt-4 w-[10%]">
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
                      <DropdownMenuItem onClick={() => setIsEditing(true)}>
                        Edit
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem variant="destructive" onClick={() => handleDeleteProject(project)}>
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
                <CvProjectsForm 
                id={project.id}
                isEditing={isEditing} 
                closeEditing={() => setIsEditing(false)} 
                initialData={{
                            name: project.name,
                            domain: project.domain,
                            start_date: project.start_date,
                            end_date: project.end_date,
                            description: project.description,
                            environment: project.environment,
                            responsibilities: project.responsibilities.join('\n'),
                        }}/>
              </TableCell>
            </TableRow>
            <TableRow 
            className={(isCurrentHovered ? "bg-muted/50" : "bg-background") + " last:border-b-0"}
              onMouseEnter={() => setHoveredProjectId(project.id)}
              onMouseLeave={() => setHoveredProjectId(null)}
            >
              <TableCell colSpan={5} className="space-y-4 pt-0 align-top">
                <p className="w-full block opacity-50 whitespace-normal wrap-break-word">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.responsibilities.length !== 0 &&
                    project.responsibilities.map((tag, index) => {
                      return <Badge key={`tag-${tag}${index}`}>{tag}</Badge>;
                    })}
                </div>
              </TableCell>
            </TableRow>
            </React.Fragment>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default CvProjectsList;
