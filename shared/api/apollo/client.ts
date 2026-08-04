import { ApolloLink } from "@apollo/client";
import { ApolloClient, InMemoryCache } from "@apollo/client-integration-nextjs";

import { authLink } from "./auth-link";
import { errorLink } from "./error-link";
import { httpLink } from "./http-link";

export function makeClient() {
  return new ApolloClient({
    cache: new InMemoryCache({
      typePolicies: {
        Cv: {
          fields: {
            skills: {
              merge(existing, incoming) {
                return incoming;
              },
            },
            projects: {
              merge(existing, incoming) {
                return incoming;
              },
            },
          },
        }
      }
    }),

    link: ApolloLink.from([errorLink, authLink, httpLink]),
  });
}
