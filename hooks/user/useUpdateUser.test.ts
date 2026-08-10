import { useMutation } from "@apollo/client/react";
import { act, renderHook } from "@testing-library/react";
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type MockedFunction,
} from "vitest";

import { useUpdateUser } from "./useUpdateUser";

import { GET_USER } from "@/graphql/user/queries";

vi.mock("@apollo/client/react", () => ({
  useMutation: vi.fn(),
}));

describe("useUpdateUser Hook Component Module", () => {
  const mockUpdateProfile = vi.fn();
  const mockUpdateUser = vi.fn();
  const mockUploadAvatar = vi.fn();

  const mockPayloadData = {
    userId: "user-999",
    firstName: "Alex",
    lastName: "Smith",
    departmentId: "dep-core-1",
    positionId: "pos-lead-2",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "warn").mockImplementation(() => {});

    // Ensure all internal triggered mutation execution loops return successfully
    mockUpdateProfile.mockResolvedValue({ data: {} });
    mockUpdateUser.mockResolvedValue({ data: {} });
    mockUploadAvatar.mockResolvedValue({ data: {} });

    let mutationIndex = 0;
    const mockMutationsList = [
      mockUpdateProfile,
      mockUpdateUser,
      mockUploadAvatar,
    ];

    (
      useMutation as unknown as MockedFunction<typeof useMutation>
    ).mockImplementation(() => {
      const activeMockFn = mockMutationsList[mutationIndex] || vi.fn();
      mutationIndex++;
      return [activeMockFn, { loading: false }] as any;
    });
  });

  describe("Hook Parameters Initialization", () => {
    it("should aggregate internal loading flag variables into a single compound state value", () => {
      let mutationCallCount = 0;
      (
        useMutation as unknown as MockedFunction<typeof useMutation>
      ).mockImplementation(() => {
        // Force the second mutation mock array block to indicate loading states are active
        const isLoadingStateActive = mutationCallCount === 1;
        mutationCallCount++;
        return [vi.fn(), { loading: isLoadingStateActive }] as any;
      });

      const { result } = renderHook(() => useUpdateUser());
      expect(result.current.isLoading).toBe(true);
    });
  });

  describe("Mutation Executions & Conditional Branching Paths", () => {
    it("should trigger base user mutations without executing an avatar upload payload", async () => {
      const { result } = renderHook(() => useUpdateUser());

      let executionResponse;
      await act(async () => {
        executionResponse = await result.current.updateUser(mockPayloadData);
      });

      // Verify Profile field properties mutate successfully alongside standard query refetch rules mappings
      expect(mockUpdateProfile).toHaveBeenCalledWith({
        variables: {
          profile: {
            userId: "user-999",
            first_name: "Alex",
            last_name: "Smith",
          },
        },
        refetchQueries: [
          { query: GET_USER, variables: { userId: "user-999" } },
        ],
      });

      // Verify User field properties mutate successfully alongside standard query refetch rules mappings
      expect(mockUpdateUser).toHaveBeenCalledWith({
        variables: {
          user: {
            userId: "user-999",
            departmentId: "dep-core-1",
            positionId: "pos-lead-2",
          },
        },
        refetchQueries: [
          { query: GET_USER, variables: { userId: "user-999" } },
        ],
      });

      // Confirm avatar mutation layer gets completely skipped when variables are absent
      expect(mockUploadAvatar).not.toHaveBeenCalled();
      expect(executionResponse).toEqual({ success: true });
    });

    it("should process additional avatar image attachment payloads when valid binary file fragments are provided", async () => {
      const { result } = renderHook(() => useUpdateUser());

      const dummyFileAsset = new File(["dummy content text"], "photo.png", {
        type: "image/png",
      });
      Object.defineProperty(dummyFileAsset, "size", { value: 5048 });

      await act(async () => {
        await result.current.updateUser({
          ...mockPayloadData,
          avatarFile: dummyFileAsset,
          avatarBase64: "data:image/png;base64,VXBkYXRlZEF2YXRhcg==",
        });
      });

      // ✅ FIX COVERAGE: Verifies all uploadAvatar mutation triggers evaluate completely inside the active pathing tree
      expect(mockUploadAvatar).toHaveBeenCalledWith({
        variables: {
          avatar: {
            userId: "user-999",
            base64: "data:image/png;base64,VXBkYXRlZEF2YXRhcg==",
            size: 5048,
            type: "image/png",
          },
        },
        refetchQueries: [
          { query: GET_USER, variables: { userId: "user-999" } },
        ],
        awaitRefetchQueries: true,
      });
    });

    it("should absorb exceptions safely inside its catch statement scope if the avatar upload process fails", async () => {
      const { result } = renderHook(() => useUpdateUser());

      // Simulate a network failure on the third mutation sequence
      mockUploadAvatar.mockRejectedValueOnce(
        new Error("Storage bucket allocation limit hit exception"),
      );

      const dummyFileAsset = new File(["dummy"], "test.jpg", {
        type: "image/jpeg",
      });

      let executionResponse;
      // ✅ FIX COVERAGE: Confirms that error rejections are caught smoothly inside console wrappers without blocking execution
      await act(async () => {
        executionResponse = await result.current.updateUser({
          ...mockPayloadData,
          avatarFile: dummyFileAsset,
          avatarBase64: "data:image/jpeg;base64,abc",
        });
      });

      expect(mockUploadAvatar).toHaveBeenCalled();
      expect(console.warn).toHaveBeenCalledWith(
        "Ошибка загрузки аватарки:",
        expect.any(Error),
      );
      expect(executionResponse).toEqual({ success: true }); // Verifies clean code thread exit workflows
    });
  });
});
