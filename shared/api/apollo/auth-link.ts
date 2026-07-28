import { SetContextLink } from "@apollo/client/link/context";

import { getAccessToken } from "@/shared/lib/auth";

export const authLink = new SetContextLink((prevContext) => {
  const token = getAccessToken();

  return {
    headers: {
      ...prevContext.headers,

      authorization: token ? `Bearer ${token}` : "",
    },
  };
});
