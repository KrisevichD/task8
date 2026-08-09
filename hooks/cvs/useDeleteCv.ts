import { useMutation } from "@apollo/client/react";
import { toast } from "sonner";

import { useLanguage } from "@/context/language";
import { DELETE_CV_MUTATION } from "@/graphql/cvs/mutations";
import { GET_CVS } from "@/graphql/cvs/queries";

export const useDeleteCv = () => {
  const { t } = useLanguage();
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
      loading: `${t("deleting")} ${t("cv")}...`,
      success: `CV ${t("successfully")} ${t("deleted")}!`,
      error: (err) => `${t("errorMessage")} ${err.message}`,
      position: "top-right",
    });

    return promise;
  };

  return { deleteCv };
};
