import { getRefreshToken, setTokens } from "@/shared/lib/auth";

export const refreshAuthTokens = async (): Promise<string | null> => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    return null;
  }

  try {
    const response = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
      },
      body: JSON.stringify({
        query: `
          mutation UpdateToken {
            updateToken {
              access_token
              refresh_token
            }
          }
        `,
      }),
    });

    const json = await response.json();

    const tokens = json?.data?.updateToken;

    if (!tokens?.access_token) {
      return null;
    }

    setTokens({
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
    });

    return tokens.access_token;
  } catch (error) {
    console.error("Refresh token error", error);
    return null;
  }
};
