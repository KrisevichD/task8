import { ApolloLink } from "@apollo/client";
import { ApolloClient, InMemoryCache } from "@apollo/client-integration-nextjs";

import { authLink } from "./auth-link";
import { errorLink } from "./error-link";
import { httpLink } from "./http-link";

export function makeClient() {
  return new ApolloClient({
    cache: new InMemoryCache(),

    link: ApolloLink.from([errorLink, authLink, httpLink]),
  });
}
