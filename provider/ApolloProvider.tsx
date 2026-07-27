"use client";

import { ApolloNextAppProvider } from "@apollo/client-integration-nextjs";

import { makeClient } from "@/shared/api/apollo/client";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}
