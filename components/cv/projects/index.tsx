import React from "react";

import CvProjectsForm from "./form";
import CvProjectsList from "./list";

import { Icon } from "@/components/ui/icon";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

const CvProjects = () => {
  return (
    <>
      <div className="flex justify-between px-5 py-2">
        <InputGroup variant={"search"} className="w-80">
          <InputGroupInput />
          <InputGroupAddon align={"inline-start"}>
            <InputGroupButton variant={"ghost"} size={"icon"}>
              <Icon variant="search" label="Search" />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <CvProjectsForm />
      </div>
      <CvProjectsList />
    </>
  );
};

export default CvProjects;
