import Cookies from "js-cookie";

export const getAccessToken = () => {
  return Cookies.get("access_token");
};

export const getRefreshToken = () => {
  return Cookies.get("refresh_token");
};

export const setTokens = ({
  accessToken,
  refreshToken,
}: {
  accessToken: string;
  refreshToken?: string;
}) => {
  Cookies.set("access_token", accessToken, {
    expires: 7,
  });

  if (refreshToken) {
    Cookies.set("refresh_token", refreshToken, {
      expires: 7,
    });
  }
};

export const clearTokens = () => {
  Cookies.remove("access_token");
  Cookies.remove("refresh_token");
};

export const logout = () => {
  clearTokens();

  if (
    typeof window !== "undefined" &&
    !window.location.pathname.startsWith("/login")
  ) {
    window.location.href = "/login";
  }
};
