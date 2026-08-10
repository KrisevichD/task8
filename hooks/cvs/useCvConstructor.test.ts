import { useMutation, useQuery } from "@apollo/client/react";
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

import useCvConstructor from "./useCvConstructor";

import { ICreateCvProjectForm, ICvProject } from "@/types/cv-constructor";
import { IProfileSkill } from "@/types/skills";

// ✅ Inherited globally from your setup configuration. No manual useLanguage mock needed here.

vi.mock("@apollo/client/react", () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    promise: vi.fn(),
  },
}));

vi.mock("@/utils/helpers", () => ({
  validateDateString: vi.fn((date) => date),
}));

describe("useCvConstructor Hook", () => {
  const mockCreateProject = vi.fn();
  const mockDeleteProject = vi.fn();
  const mockExecuteAddCvProject = vi.fn();
  const mockExecuteUpdateCvProject = vi.fn();
  const mockExecuteUpdateCv = vi.fn();
  const mockExecuteAddCvSkill = vi.fn();
  const mockExecuteUpdateCvSkill = vi.fn();
  const mockExecuteDeleteCvSkill = vi.fn();

  const mockCvData = {
    id: "cv-123",
    name: "Original Name",
    description: "Original Desc",
    skills: [{ name: "React", categoryId: "cat-1", mastery: "Advanced" }],
  };

  beforeEach(() => {
    vi.clearAllMocks();

    (useQuery as unknown as MockedFunction<typeof useQuery>).mockReturnValue({
      data: { cv: mockCvData },
      loading: false,
      error: null,
    } as any);

    // ✅ FIX: Mock trigger functions to return a resolved Promise by default.
    // This fixes toast.promise receiving 'undefined' instead of a valid Promise.
    mockCreateProject.mockResolvedValue({ data: {} });
    mockDeleteProject.mockResolvedValue({ data: {} });
    mockExecuteAddCvProject.mockResolvedValue({ data: {} });
    mockExecuteUpdateCvProject.mockResolvedValue({ data: {} });
    mockExecuteUpdateCv.mockResolvedValue({ data: {} });
    mockExecuteAddCvSkill.mockResolvedValue({ data: {} });
    mockExecuteUpdateCvSkill.mockResolvedValue({ data: {} });
    mockExecuteDeleteCvSkill.mockResolvedValue({ data: {} });

    let mutationIndex = 0;
    const mockMutations = [
      mockCreateProject,
      mockDeleteProject,
      mockExecuteAddCvProject,
      mockExecuteUpdateCvProject,
      mockExecuteUpdateCv,
      mockExecuteAddCvSkill,
      mockExecuteUpdateCvSkill,
      mockExecuteDeleteCvSkill,
    ];

    (
      useMutation as unknown as MockedFunction<typeof useMutation>
    ).mockImplementation(() => {
      const mockFn =
        mockMutations[mutationIndex] ||
        vi.fn(() => Promise.resolve({ data: {} }));
      mutationIndex++;
      return [mockFn, { loading: false, error: null }] as any;
    });
  });

  describe("Initialization & Queries", () => {
    it("should fetch CV data by specified identifier variables", () => {
      const { result } = renderHook(() => useCvConstructor("cv-123"));

      expect(useQuery).toHaveBeenCalledWith(expect.any(Object), {
        variables: { cvId: "cv-123" },
        skip: false,
      });
      expect(result.current.cvData).toEqual(mockCvData);
    });
  });

  describe("Project Modifications", () => {
    it("should process multi-step creation workflows and map responsibilities text into arrays", async () => {
      mockCreateProject.mockResolvedValueOnce({
        data: {
          createProject: {
            id: "proj-777",
            start_date: "2026-01-01",
            end_date: "2026-08-10",
          },
        },
      });

      const { result } = renderHook(() => useCvConstructor("cv-123"));

      const projectForm: ICreateCvProjectForm = {
        name: "E-Commerce",
        domain: "Retail",
        environment: ["React"],
        description: "App development",
        start_date: "2026-01-01",
        end_date: "2026-08-10",
        responsibilities: "Designed UI\nOptimized Performance",
      };

      await act(async () => {
        await result.current.addCvProject(projectForm);
      });

      expect(mockCreateProject).toHaveBeenCalledWith({
        variables: {
          project: {
            name: "E-Commerce",
            domain: "Retail",
            environment: ["React"],
            description: "App development",
            start_date: "2026-01-01",
            end_date: "2026-08-10",
          },
        },
      });

      expect(mockExecuteAddCvProject).toHaveBeenCalledWith({
        variables: {
          project: {
            cvId: "cv-123",
            projectId: "proj-777",
            start_date: "2026-01-01",
            end_date: "2026-08-10",
            roles: [],
            responsibilities: ["Designed UI", "Optimized Performance"],
          },
        },
      });

      expect(toast.promise).toHaveBeenCalledWith(
        expect.any(Promise),
        expect.objectContaining({
          loading: "Adding project...",
          success: "Project successfully added!",
        }),
      );
    });

    it("should trigger update operations with concatenated configurations", async () => {
      const { result } = renderHook(() => useCvConstructor("cv-123"));

      const patchForm: ICreateCvProjectForm = {
        name: "E-Commerce",
        domain: "Retail",
        environment: ["React"],
        description: "App development",
        start_date: "2026-01-01",
        end_date: "2026-08-10",
        responsibilities: "Fixed Core Bugs\n",
      };

      await act(async () => {
        await result.current.updateCvProject("proj-abc", patchForm);
      });

      expect(mockExecuteUpdateCvProject).toHaveBeenCalledWith({
        variables: {
          project: {
            cvId: "cv-123",
            projectId: "proj-abc",
            start_date: "2026-01-01",
            end_date: "2026-08-10",
            roles: [],
            responsibilities: ["Fixed Core Bugs"],
          },
        },
      });

      expect(toast.promise).toHaveBeenCalledWith(
        expect.any(Promise),
        expect.objectContaining({
          loading: "Updating project...",
          success: "Project successfully updated!",
        }),
      );
    });

    it("should dispatch delete operations case-insensitively using production messages", async () => {
      const { result } = renderHook(() => useCvConstructor("cv-123"));

      const target: ICvProject = {
        project: { id: "p-99" },
      } as any;

      await act(async () => {
        await result.current.deleteCvProject({
          cvId: "cv-123",
          project: target,
        });
      });

      expect(mockDeleteProject).toHaveBeenCalledWith({
        variables: { project: { projectId: "p-99" } },
      });

      expect(toast.promise).toHaveBeenCalledWith(
        expect.any(Promise),
        expect.objectContaining({
          loading: "Deleting project...",
          success: "Project successfully deleted!",
        }),
      );
    });
  });

  describe("Skill Modifications", () => {
    it("should dispatch addCvSkill payloads with exact toast output matchers", () => {
      const { result } = renderHook(() => useCvConstructor("cv-123"));

      const newSkill: IProfileSkill = {
        name: "TypeScript",
        categoryId: "cat-1",
        mastery: "Expert",
      };

      act(() => {
        result.current.addCvSkill(newSkill);
      });

      expect(mockExecuteAddCvSkill).toHaveBeenCalledWith(
        expect.objectContaining({
          variables: { skill: { cvId: "cv-123", ...newSkill } },
        }),
      );

      expect(toast.promise).toHaveBeenCalledWith(
        expect.any(Promise),
        expect.objectContaining({
          loading: "Adding skill...",
          success: "Skill successfully added!",
        }),
      );
    });

    it("should trigger updateCvSkill", () => {
      const { result } = renderHook(() => useCvConstructor("cv-123"));

      const target: IProfileSkill = {
        name: "React",
        categoryId: "cat-1",
        mastery: "Expert",
      };

      act(() => {
        result.current.updateCvSkill(target);
      });

      expect(mockExecuteUpdateCvSkill).toHaveBeenCalledWith(
        expect.objectContaining({
          variables: { skill: { cvId: "cv-123", ...target } },
        }),
      );

      expect(toast.promise).toHaveBeenCalledWith(
        expect.any(Promise),
        expect.objectContaining({
          loading: "Updating skill...",
          success: "Skill successfully updated!",
        }),
      );
    });

    it("should delete skills successfully through arrays of name strings", () => {
      const { result } = renderHook(() => useCvConstructor("cv-123"));

      act(() => {
        result.current.deleteCvSkill(["React"]);
      });

      expect(mockExecuteDeleteCvSkill).toHaveBeenCalledWith(
        expect.objectContaining({
          variables: { skill: { cvId: "cv-123", name: ["React"] } },
        }),
      );

      expect(toast.promise).toHaveBeenCalledWith(
        expect.any(Promise),
        expect.objectContaining({
          loading: "Deleting skill...",
          success: "Skill successfully deleted!",
        }),
      );
    });
  });

  describe("Root CV Properties Modifications", () => {
    it("should process updateCv mutations with production text formatting layouts", () => {
      const { result } = renderHook(() => useCvConstructor("cv-123"));

      const payload = {
        cvId: "cv-123",
        name: "Brand New Title",
        education: "BSc Computer Science",
        description: "Updated profile overview details",
      };

      act(() => {
        result.current.updateCv(payload);
      });

      expect(mockExecuteUpdateCv).toHaveBeenCalledWith({
        variables: { cv: payload },
      });

      // ✅ FIX: Updated to uppercase "Updating CV..." to align exactly with your source hook logic
      expect(toast.promise).toHaveBeenCalledWith(
        expect.any(Promise),
        expect.objectContaining({
          loading: "Updating CV...",
          success: "CV successfully updated!",
        }),
      );
    });
  });
});
