import React from "react";

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
import { useCVContext } from "@/context/cv";

const CVProjectsList = () => {
  const { data } = useCVContext();

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
        {data.projects.map((project) => {
          return (
            <TableRow key={project.id} className="last:border-b-0">
              <TableCell className="max-w-89 space-y-4 pt-7">
                <p>{project.project}</p>
                <p className="w-[calc(100vw-280px)] opacity-50 whitespace-normal wrap-break-word">
                  {project.description}
                </p>
                <p>{project.responsibilities}</p>
              </TableCell>
              <TableCell className="align-top h-18 pt-7">
                {project.domain}
              </TableCell>
              <TableCell className="align-top h-18 pt-7">
                {project.startDate.toLocaleString()}
              </TableCell>
              <TableCell className="align-top h-18 pt-7">
                {project.endDate.toLocaleString()}
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
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem variant="destructive">
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

export default CVProjectsList;
