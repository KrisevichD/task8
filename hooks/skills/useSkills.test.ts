import { useLazyQuery, useMutation, useQuery } from "@apollo/client/react";
import { act, renderHook } from "@testing-library/react";
import { toast } from "sonner";
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type MockedFunction,
} from "vitest";

import { useMe } from "../auth/useMe";

import useSkills from "./useSkills";

import { IProfileSkill } from "@/types/skills";
import { getUserIdFromToken } from "@/utils/jwt";

vi.mock("@apollo/client/react", () => ({
  useQuery: vi.fn(),
  useLazyQuery: vi.fn(),
  useMutation: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    promise: vi.fn(),
  },
}));

vi.mock("../auth/useMe", () => ({
  useMe: vi.fn(),
}));

vi.mock("@/utils/jwt", () => ({
  getUserIdFromToken: vi.fn(),
}));

describe("useSkills Hook", () => {
  const mockGetAllSkills = vi.fn();
  const mockExecuteAddProfileSkill = vi.fn();
  const mockExecuteUpdateProfileSkill = vi.fn();
  const mockExecuteDeleteProfileSkills = vi.fn();

  const mockCategories = [
    { id: "cat-1", name: "Frontend" },
    { id: "cat-2", name: "Backend" },
  ];

  const mockProfileSkills: IProfileSkill[] = [
    {
      name: "React",
      categoryId: "cat-1",
      mastery: "Advanced",
    } as unknown as IProfileSkill,
  ];

  const mockAllSkills = {
    skills: [
      { name: "React", categoryId: "cat-1" },
      { name: "Vue", categoryId: "cat-1" },
      { name: "Node.js", categoryId: "cat-2" },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();

    (
      getUserIdFromToken as unknown as MockedFunction<typeof getUserIdFromToken>
    ).mockReturnValue("user-token-123");

    (useMe as unknown as MockedFunction<typeof useMe>).mockReturnValue({
      skills: mockProfileSkills,
    } as any);

    (useQuery as unknown as MockedFunction<typeof useQuery>).mockReturnValue({
      data: { skillCategories: mockCategories },
      loading: false,
    } as any);

    (
      useLazyQuery as unknown as MockedFunction<typeof useLazyQuery>
    ).mockReturnValue([
      mockGetAllSkills,
      { data: mockAllSkills, loading: false },
    ] as any);

    (useMutation as unknown as MockedFunction<typeof useMutation>)
      .mockReturnValueOnce([
        mockExecuteAddProfileSkill,
        { loading: false },
      ] as any)
      .mockReturnValueOnce([
        mockExecuteUpdateProfileSkill,
        { loading: false },
      ] as any)
      .mockReturnValueOnce([
        mockExecuteDeleteProfileSkills,
        { loading: false },
      ] as any);
  });

  describe("Queries & Initialization", () => {
    it("fetches categories and filters out user existing skills", () => {
      const { result } = renderHook(() => useSkills("user-123"));

      expect(result.current.skillCategories).toEqual(mockCategories);
      expect(result.current.filteredSkills).toEqual([
        { name: "Vue", categoryId: "cat-1" },
        { name: "Node.js", categoryId: "cat-2" },
      ]);
    });

    it("uses getUserIdFromToken if customUserId is not provided", () => {
      renderHook(() => useSkills());

      expect(getUserIdFromToken).toHaveBeenCalled();
      expect(useMe).toHaveBeenCalledWith("user-token-123");
    });
  });

  describe("Mutations", () => {
    it("addProfileSkill triggers mutation and toast.promise", () => {
      const { result } = renderHook(() => useSkills("user-123"));

      const newSkill: IProfileSkill = {
        name: "TypeScript",
        categoryId: "cat-1",
        mastery: "Intermediate",
      } as unknown as IProfileSkill;

      act(() => {
        result.current.addProfileSkill(newSkill);
      });

      expect(mockExecuteAddProfileSkill).toHaveBeenCalledWith(
        expect.objectContaining({
          variables: {
            skill: {
              userId: "user-123",
              ...newSkill,
            },
          },
        }),
      );

      expect(toast.promise).toHaveBeenCalledWith(
        undefined,
        expect.objectContaining({
          loading: "Adding skill",
          success: "Successfully added",
          position: "top-right",
        }),
      );
    });

    it("updateProfileSkill triggers mutation and toast.promise", async () => {
      const { result } = renderHook(() => useSkills("user-123"));

      const updatedSkill: IProfileSkill = {
        name: "React",
        categoryId: "cat-1",
        mastery: "Expert",
      } as unknown as IProfileSkill;

      await act(async () => {
        await result.current.updateProfileSkill(updatedSkill);
      });

      expect(mockExecuteUpdateProfileSkill).toHaveBeenCalledWith(
        expect.objectContaining({
          variables: {
            skill: {
              userId: "user-123",
              ...updatedSkill,
            },
          },
        }),
      );

      expect(toast.promise).toHaveBeenCalledWith(
        undefined,
        expect.objectContaining({
          loading: "Updating skill mastery",
          success: "Skill is updated",
          position: "top-right",
        }),
      );
    });

    it("deleteProfileSkills triggers delete mutation with skill names array", () => {
      const { result } = renderHook(() => useSkills("user-123"));

      act(() => {
        result.current.deleteProfileSkills(["React"]);
      });

      expect(mockExecuteDeleteProfileSkills).toHaveBeenCalledWith(
        expect.objectContaining({
          variables: {
            skill: {
              userId: "user-123",
              name: ["React"],
            },
          },
        }),
      );

      expect(toast.promise).toHaveBeenCalledWith(
        undefined,
        expect.objectContaining({
          loading: "Deleting skills",
          success: "Successfully deleted",
          position: "top-right",
        }),
      );
    });

    it("does not trigger mutations if userId is absent", () => {
      (
        getUserIdFromToken as unknown as MockedFunction<
          typeof getUserIdFromToken
        >
      ).mockReturnValue("");

      const { result } = renderHook(() => useSkills());

      act(() => {
        result.current.addProfileSkill({ name: "Python" } as any);
        result.current.updateProfileSkill({ name: "Python" } as any);
        result.current.deleteProfileSkills(["Python"]);
      });

      expect(mockExecuteAddProfileSkill).not.toHaveBeenCalled();
      expect(mockExecuteUpdateProfileSkill).not.toHaveBeenCalled();
      expect(mockExecuteDeleteProfileSkills).not.toHaveBeenCalled();
    });
  });
});
