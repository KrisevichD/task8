"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import { CREATE_CV_MUTATION } from "@/graphql/cvs";
import useCreateCv from "@/hooks/cvs/useCreateCv";

const CvsContent = () => {
  const { createCv, isLoading } = useCreateCv(CREATE_CV_MUTATION);

  const handleCreateCv = async () => {
    console.log(">>>");
    const responce = await createCv({
      cv: {
        userId: "610",
        name: "CV",
        description: "CV description",
        education: "CV education",
      },
    });

    console.log(responce);
  };

  return (
    <div>
      <Button variant={"primary"} onClick={() => handleCreateCv()}>
        CREATE CV
      </Button>
    </div>
  );
};

export default CvsContent;
