"use client";

import { useApolloClient } from "@apollo/client/react";
import { useRouter } from "next/navigation";

export const useLogout = () => {
  const router = useRouter();
  const client = useApolloClient();

  const logout = () => {
    document.cookie = "access_token=; path=/; max-age=0";
    document.cookie = "refresh_token=; path=/; max-age=0";

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    client.clearStore().catch(() => {});

    router.push("/login");
    router.refresh();
  };

  return { logout };
};
