import { useMutation } from "@apollo/client/react";
import { toast } from "sonner";

import { DELETE_CV_MUTATION } from "@/graphql/cvs/mutations";
import { GET_CVS } from "@/graphql/cvs/queries";

export const useDeleteCv = () => {
  const [deleteCvMutation] = useMutation(DELETE_CV_MUTATION, {
    refetchQueries: [{ query: GET_CVS }],
  });

  const deleteCv = async (cvId: string) => {
    const promise = deleteCvMutation({
      variables: {
        cv: {
          cvId: cvId,
        },
      },
    });

    toast.promise(promise, {
      loading: "Deleting CV...",
      success: "Successfully deleted",
      error: (err) => err.message || "Failed to delete CV",
      position: "top-right",
    });

    return promise;
  };

  return { deleteCv };
};
