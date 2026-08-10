import { useQuery } from "@apollo/client/react";
import { act, renderHook, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type MockedFunction,
} from "vitest";

import { useEmployeeDetailsForm } from "./useEmployeeDetailsForm";

import { useLanguage } from "@/context/language";
import { GET_DEPARTMENTS } from "@/graphql/department/queries";
import { GET_POSITIONS } from "@/graphql/position/queries";
import { useUpdateUser } from "@/hooks/user/useUpdateUser";

vi.mock("@apollo/client/react", () => ({
  useQuery: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    promise: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@/context/language", () => ({
  useLanguage: vi.fn(),
}));

vi.mock("@/hooks/user/useUpdateUser", () => ({
  useUpdateUser: vi.fn(),
}));

describe("useEmployeeDetailsForm Hook Module", () => {
  const mockUpdateUserFn = vi.fn();
  const mockT = vi.fn((key: string) => key);

  const mockUserPayload = {
    id: "user-target-456",
    department_name: "Engineering",
    position_name: "Frontend Developer",
    profile: {
      first_name: "John",
      last_name: "Doe",
    },
  };

  const mockDepartments = {
    departments: [
      { id: "dept-1", name: "Engineering" },
      { id: "dept-2", name: "Marketing" },
    ],
  };

  const mockPositions = {
    positions: [
      { id: "pos-1", name: "Frontend Developer" },
      { id: "pos-2", name: "Product Manager" },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();

    (
      useLanguage as unknown as MockedFunction<typeof useLanguage>
    ).mockReturnValue({
      t: mockT,
    } as any);

    (
      useUpdateUser as unknown as MockedFunction<typeof useUpdateUser>
    ).mockReturnValue({
      updateUser: mockUpdateUserFn,
      isLoading: false,
    });

    (useQuery as unknown as MockedFunction<typeof useQuery>).mockImplementation(
      (query: any) => {
        if (query === GET_DEPARTMENTS) {
          return { data: mockDepartments } as any;
        }
        if (query === GET_POSITIONS) {
          return { data: mockPositions } as any;
        }
        return { data: null } as any;
      },
    );
  });

  describe("🎯 Avatar Modification Upload and File Size Guard Blocks", () => {
    it("should block asset processing and trigger toast.error if file size crosses 0.5MB limit", () => {
      const { result } = renderHook(() =>
        useEmployeeDetailsForm("user-target-456", mockUserPayload as any),
      );

      const largeFile = new File([""], "huge-avatar.png", {
        type: "image/png",
      });
      Object.defineProperty(largeFile, "size", { value: 0.6 * 1024 * 1024 });

      act(() => {
        result.current.handleAvatarChange({
          target: { files: [largeFile] },
        } as any);
      });

      expect(toast.error).toHaveBeenCalledWith(
        expect.stringContaining("File size should be no more than 0.5MB"),
        expect.objectContaining({ position: "top-right" }),
      );
      expect(result.current.avatarPreview).toBeNull();
    });

    it("should successfully initialize FileReader pipelines upon valid file input selection size streams", async () => {
      const { result } = renderHook(() =>
        useEmployeeDetailsForm("user-target-456", mockUserPayload as any),
      );

      act(() => {
        result.current.form.setValue("firstName", "John", {
          shouldValidate: true,
        });
      });

      const validFile = new File(["avatar-stream"], "me.jpg", {
        type: "image/jpeg",
      });
      Object.defineProperty(validFile, "size", { value: 1024 });

      const dummyBase64 = "data:image/jpeg;base64,mockStreamBytes";
      const mockReadAsDataURL = vi.fn();

      let activeReaderInstance: any = null;
      class MockFileReader {
        readAsDataURL = mockReadAsDataURL;
        result = dummyBase64;
        onloadend = null as any;
        constructor() {
          // eslint-disable-next-line @typescript-eslint/no-this-alias
          activeReaderInstance = this;
        }
      }
      vi.stubGlobal("FileReader", MockFileReader);

      act(() => {
        result.current.handleAvatarChange({
          target: { files: [validFile] },
        } as any);
      });

      expect(mockReadAsDataURL).toHaveBeenCalledWith(validFile);

      act(() => {
        if (
          activeReaderInstance &&
          typeof activeReaderInstance.onloadend === "function"
        ) {
          activeReaderInstance.onloadend({} as any);
        }
      });

      expect(result.current.avatarPreview).toBe(dummyBase64);

      await waitFor(() => {
        expect(result.current.canSubmit).toBe(true);
      });

      vi.unstubAllGlobals();
    });
  });

  describe("🎯 Submit Conversions, Toast & Name-to-ID Lookup Branches", () => {
    it("should populate object data properties via form values mapping definitions and trigger toast.promise", async () => {
      const mockPromise = Promise.resolve({ data: true });
      mockUpdateUserFn.mockReturnValue(mockPromise);

      const { result } = renderHook(() =>
        useEmployeeDetailsForm("user-target-456", mockUserPayload as any),
      );

      await waitFor(() => {
        expect(result.current.form.getValues("firstName")).toBe("John");
      });

      act(() => {
        result.current.form.setValue("firstName", "Johnny", {
          shouldDirty: true,
          shouldValidate: true,
        });
        result.current.form.setValue("departmentId", "Marketing", {
          shouldDirty: true,
          shouldValidate: true,
        });
        result.current.form.setValue("positionId", "Product Manager", {
          shouldDirty: true,
          shouldValidate: true,
        });
      });

      await act(async () => {
        await result.current.onSubmit(result.current.form.getValues());
      });

      expect(mockUpdateUserFn).toHaveBeenCalledWith({
        userId: "user-target-456",
        firstName: "Johnny",
        lastName: "Doe",
        departmentId: "dept-2",
        positionId: "pos-2",
        avatarFile: null,
        avatarBase64: null,
      });

      expect(toast.promise).toHaveBeenCalledWith(
        mockPromise,
        expect.objectContaining({
          position: "top-right",
        }),
      );
    });

    it("should fall back directly on raw string form values if ID mapping parameters miss matching names", async () => {
      mockUpdateUserFn.mockReturnValue(Promise.resolve({ data: true }));

      const { result } = renderHook(() =>
        useEmployeeDetailsForm("user-target-456", mockUserPayload as any),
      );

      await waitFor(() => {
        expect(result.current.form.getValues("firstName")).toBe("John");
      });

      act(() => {
        result.current.form.setValue("firstName", "John", {
          shouldDirty: true,
          shouldValidate: true,
        });
        (result.current.form.setValue as any)(
          "departmentId",
          "Custom NonExistent Dept",
          { shouldDirty: true, shouldValidate: true },
        );
        (result.current.form.setValue as any)(
          "positionId",
          "Custom NonExistent Pos",
          { shouldDirty: true, shouldValidate: true },
        );
      });

      await act(async () => {
        await result.current.onSubmit(result.current.form.getValues());
      });

      expect(mockUpdateUserFn).toHaveBeenCalledWith(
        expect.objectContaining({
          departmentId: "Custom NonExistent Dept",
          positionId: "Custom NonExistent Pos",
        }),
      );
    });
  });
});
