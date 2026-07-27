import { Observable } from "@apollo/client";
import { CombinedGraphQLErrors } from "@apollo/client/errors";
import { ErrorLink } from "@apollo/client/link/error";

import { refreshAuthTokens } from "./refresh-token";

import { logout } from "@/shared/lib/auth";

let isRefreshing = false;
let pendingRequests: Array<(token: string | null) => void> = [];

const resolvePendingRequests = (token: string | null) => {
  pendingRequests.forEach((callback) => {
    callback(token);
  });
  pendingRequests = [];
};

export const errorLink = new ErrorLink(({ error, operation, forward }) => {
  if (operation.operationName === "UpdateToken") {
    return;
  }

  if (!CombinedGraphQLErrors.is(error)) {
    return;
  }

  const isUnauthorized = error.errors.some((err) => {
    const statusCode = (err.extensions?.response as { statusCode?: number })
      ?.statusCode;

    const code = err.extensions?.code;
    const message = err.message?.toLowerCase() || "";

    return (
      code === "UNAUTHENTICATED" ||
      code === "UNAUTHORIZED" ||
      code === "FORBIDDEN" ||
      statusCode === 401 ||
      statusCode === 400 ||
      message.includes("unauthorized") ||
      message.includes("jwt expired") ||
      message.includes("token expired")
    );
  });

  if (!isUnauthorized) {
    return;
  }

  return new Observable((observer) => {
    const retryRequest = (token: string) => {
      operation.setContext(({ headers = {} }) => ({
        headers: {
          ...headers,
          authorization: `Bearer ${token}`,
        },
      }));

      forward(operation).subscribe({
        next: observer.next.bind(observer),
        error: observer.error.bind(observer),
        complete: observer.complete.bind(observer),
      });
    };

    if (isRefreshing) {
      pendingRequests.push((token) => {
        if (!token) {
          observer.error(error);
          return;
        }

        retryRequest(token);
      });

      return;
    }

    isRefreshing = true;

    refreshAuthTokens()
      .then((newToken) => {
        isRefreshing = false;

        if (!newToken) {
          resolvePendingRequests(null);
          logout();
          observer.error(error);
          return;
        }

        resolvePendingRequests(newToken);
        retryRequest(newToken);
      })
      .catch((err) => {
        isRefreshing = false;
        resolvePendingRequests(null);
        logout();
        observer.error(err);
      });
  });
});
