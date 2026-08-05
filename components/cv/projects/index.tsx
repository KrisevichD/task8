import React, { useState } from "react";

import CvProjectsForm from "./form";
import CvProjectsList from "./list";

import { Icon } from "@/components/ui/icon";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

const CvProjects = () => {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <>
      <div className="flex justify-between px-5 py-2">
        <InputGroup variant={"search"} className="w-80">
          <InputGroupInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <InputGroupAddon align={"inline-start"}>
            <Icon variant="search" className="text-muted-foreground" />
          </InputGroupAddon>
        </InputGroup>
        <CvProjectsForm/>
      </div>
      <CvProjectsList searchQuery={searchQuery} />
    </>
  );
};

export default CvProjects;
