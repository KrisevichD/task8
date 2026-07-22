import Cookies from "js-cookie";

import { jwtDecode } from "jwt-decode";

interface IJwtPayload {
  sub?: string;
  id?: string;
  userId?: string;
}

export const getAccessToken = () => Cookies.get("access_token");
export const getRefreshToken = () => Cookies.get("refresh_token");

export const getUserIdFromToken = (): string | undefined => {
  const token = getAccessToken();
  if (!token) return undefined;

  try {
    const decoded = jwtDecode<IJwtPayload>(token);
    return decoded.sub || decoded.id || decoded.userId;
  } catch (error) {
    console.error("Failed to decode token", error);
    return undefined;
  }
};
