import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { getAccessToken, getRefreshToken, getUserIdFromToken } from "../jwt";

// ✅ FIX 1: Expose mock properties directly on a nested module object layout
// This prevents bundler linkage failures when utilities import default modules
vi.mock("js-cookie", () => {
  const mockGet = vi.fn();
  return {
    default: {
      get: mockGet,
    },
    get: mockGet,
  };
});

vi.mock("jwt-decode", () => ({
  jwtDecode: vi.fn(),
}));

describe("JWT Utility Helper Module", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Cookie Getters", () => {
    it("should successfully request the access_token key from storage arrays", () => {
      // ✅ FIX 2: Cast to any to cleanly bypass the multi-signature parameter type check
      (Cookies.get as any).mockReturnValueOnce("mock-access");

      const res = getAccessToken();

      expect(Cookies.get).toHaveBeenCalledWith("access_token");
      expect(res).toBe("mock-access");
    });

    it("should successfully request the refresh_token key from storage arrays", () => {
      // ✅ FIX 2: Cast to any to cleanly bypass the multi-signature parameter type check
      (Cookies.get as any).mockReturnValueOnce("mock-refresh");

      const res = getRefreshToken();

      expect(Cookies.get).toHaveBeenCalledWith("refresh_token");
      expect(res).toBe("mock-refresh");
    });
  });

  describe("getUserIdFromToken Branch Pathing Coverage", () => {
    it("should return undefined immediately if no access_token is present in cookies", () => {
      // ✅ FIX 2: Cast to any to cleanly bypass the multi-signature parameter type check
      (Cookies.get as any).mockReturnValueOnce(undefined);

      const userId = getUserIdFromToken();

      expect(userId).toBeUndefined();
      expect(jwtDecode).not.toHaveBeenCalled();
    });

    it("should resolve and prioritize the 'sub' key parameter attribute from the decoded object mapping", () => {
      (Cookies.get as any).mockReturnValueOnce("valid-token");
      vi.mocked(jwtDecode).mockReturnValueOnce({
        sub: "sub-id-111",
        id: "id-222",
        userId: "user-333",
      });

      const userId = getUserIdFromToken();

      expect(jwtDecode).toHaveBeenCalledWith("valid-token");
      expect(userId).toBe("sub-id-111");
    });

    it("should fall back onto the secondary 'id' property if the 'sub' property is absent", () => {
      (Cookies.get as any).mockReturnValueOnce("valid-token");
      vi.mocked(jwtDecode).mockReturnValueOnce({
        id: "id-222",
        userId: "user-333",
      });

      const userId = getUserIdFromToken();

      expect(userId).toBe("id-222");
    });

    it("should fall back onto the tertiary 'userId' property if both 'sub' and 'id' are missing", () => {
      (Cookies.get as any).mockReturnValueOnce("valid-token");
      vi.mocked(jwtDecode).mockReturnValueOnce({ userId: "user-333" });

      const userId = getUserIdFromToken();

      expect(userId).toBe("user-333");
    });

    it("should intercept string token decoding errors and safely return undefined", () => {
      (Cookies.get as any).mockReturnValueOnce("malformed-token-string");

      // ✅ FIX 3: Create the spy explicitly within the test block to guarantee Vitest tracks its calls
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementationOnce(() => {});

      // Force decoder method engine to fail synchronously
      vi.mocked(jwtDecode).mockImplementationOnce(() => {
        throw new Error("Invalid token signature");
      });

      const userId = getUserIdFromToken();

      expect(userId).toBeUndefined();
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to decode token",
        expect.any(Error),
      );
    });
  });
});
