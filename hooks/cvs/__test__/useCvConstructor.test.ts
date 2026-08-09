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

import useCvConstructor from "../useCvConstructor";

import {
  ICreateCvProjectForm,
  ICvProject,
  IUpdateCvInput,
} from "@/types/cv-constructor";
import { IProfileSkill } from "@/types/skills";

vi.mock("@apollo/client/react", () => ({
  useMutation: vi.fn(),
  useQuery: vi.fn(),
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
  const cvId = "cv-123";

  const mockCreateProject = vi.fn();
  const mockDeleteProject = vi.fn();
  const mockExecuteAddCvProject = vi.fn();
  const mockExecuteUpdateCvProject = vi.fn();
  const mockExecuteUpdateCv = vi.fn();
  const mockExecuteAddCvSkill = vi.fn();
  const mockExecuteUpdateCvSkill = vi.fn();
  const mockExecuteDeleteCvSkill = vi.fn();

  const mockCvData = {
    id: cvId,
    name: "John Doe CV",
    skills: [{ name: "React", categoryId: "cat-1", mastery: "Advanced" }],
  };

  beforeEach(() => {
    vi.clearAllMocks();

    (useQuery as unknown as MockedFunction<typeof useQuery>).mockReturnValue({
      data: { cv: mockCvData },
      loading: false,
      error: null,
    } as any);

    (useMutation as unknown as MockedFunction<typeof useMutation>)
      .mockReturnValueOnce([mockCreateProject] as any)
      .mockReturnValueOnce([mockDeleteProject] as any)
      .mockReturnValueOnce([
        mockExecuteAddCvProject,
        { loading: false, error: null },
      ] as any)
      .mockReturnValueOnce([mockExecuteUpdateCvProject] as any)
      .mockReturnValueOnce([mockExecuteUpdateCv] as any)
      .mockReturnValueOnce([mockExecuteAddCvSkill] as any)
      .mockReturnValueOnce([mockExecuteUpdateCvSkill] as any)
      .mockReturnValueOnce([mockExecuteDeleteCvSkill] as any);
  });

  describe("Query State", () => {
    it("returns cvData and loading states correctly", () => {
      const { result } = renderHook(() => useCvConstructor(cvId));

      expect(result.current.cvData).toEqual(mockCvData);
      expect(result.current.isCvLoading).toBe(false);
      expect(result.current.cvError).toBeNull();
    });
  });

  describe("Projects Management", () => {
    it("addCvProject creates project and triggers toast.promise", async () => {
      mockCreateProject.mockResolvedValueOnce({
        data: {
          createProject: {
            id: "proj-1",
            start_date: "2023-01-01",
            end_date: "2023-12-31",
          },
        },
      });

      const { result } = renderHook(() => useCvConstructor(cvId));

      const inputForm: ICreateCvProjectForm = {
        name: "Project Alpha",
        description: "Test Desc",
        responsibilities: "Dev\nTesting",
        start_date: "2023-01-01",
        end_date: "2023-12-31",
      } as unknown as ICreateCvProjectForm;

      await act(async () => {
        await result.current.addCvProject(inputForm);
      });

      expect(mockCreateProject).toHaveBeenCalledWith({
        variables: {
          project: {
            name: "Project Alpha",
            description: "Test Desc",
            start_date: "2023-01-01",
            end_date: "2023-12-31",
          },
        },
      });

      expect(mockExecuteAddCvProject).toHaveBeenCalledWith({
        variables: {
          project: {
            cvId,
            projectId: "proj-1",
            start_date: "2023-01-01",
            end_date: "2023-12-31",
            roles: [],
            responsibilities: ["Dev", "Testing"],
          },
        },
      });

      expect(toast.promise).toHaveBeenCalled();
    });

    it("updateCvProject calls executeUpdateCvProject and toast.promise", async () => {
      const { result } = renderHook(() => useCvConstructor(cvId));

      const inputForm: ICreateCvProjectForm = {
        responsibilities: "Feature A\nFeature B",
        start_date: "2023-01-01",
        end_date: "2023-06-01",
      } as unknown as ICreateCvProjectForm;

      await act(async () => {
        await result.current.updateCvProject("proj-1", inputForm);
      });

      expect(mockExecuteUpdateCvProject).toHaveBeenCalledWith({
        variables: {
          project: {
            cvId,
            projectId: "proj-1",
            start_date: "2023-01-01",
            end_date: "2023-06-01",
            roles: [],
            responsibilities: ["Feature A", "Feature B"],
          },
        },
      });

      expect(toast.promise).toHaveBeenCalled();
    });

    it("deleteCvProject executes deleteProject and triggers toast.promise", async () => {
      const { result } = renderHook(() => useCvConstructor(cvId));

      const mockProject = {
        project: { id: "proj-1" },
      } as unknown as ICvProject;

      await act(async () => {
        await result.current.deleteCvProject({ cvId, project: mockProject });
      });

      expect(mockDeleteProject).toHaveBeenCalledWith({
        variables: { project: { projectId: "proj-1" } },
      });

      expect(toast.promise).toHaveBeenCalled();
    });
  });

  describe("Skills Management", () => {
    it("addCvSkill executes mutation with optimisticResponse", () => {
      const { result } = renderHook(() => useCvConstructor(cvId));

      const skillInput: IProfileSkill = {
        name: "TypeScript",
        categoryId: "cat-1",
        mastery: "Intermediate",
      } as unknown as IProfileSkill;

      act(() => {
        result.current.addCvSkill(skillInput);
      });

      expect(mockExecuteAddCvSkill).toHaveBeenCalledWith(
        expect.objectContaining({
          variables: {
            skill: {
              cvId,
              ...skillInput,
            },
          },
        }),
      );

      expect(toast.promise).toHaveBeenCalled();
    });

    it("updateCvSkill executes mutation with updated skill list in optimisticResponse", () => {
      const { result } = renderHook(() => useCvConstructor(cvId));

      const updatedSkill: IProfileSkill = {
        name: "React",
        categoryId: "cat-1",
        mastery: "Expert",
      } as unknown as IProfileSkill;

      act(() => {
        result.current.updateCvSkill(updatedSkill);
      });

      expect(mockExecuteUpdateCvSkill).toHaveBeenCalledWith(
        expect.objectContaining({
          variables: {
            skill: {
              cvId,
              ...updatedSkill,
            },
          },
        }),
      );

      expect(toast.promise).toHaveBeenCalled();
    });

    it("deleteCvSkill executes delete mutation with skill names array", () => {
      const { result } = renderHook(() => useCvConstructor(cvId));

      act(() => {
        result.current.deleteCvSkill(["React"]);
      });

      expect(mockExecuteDeleteCvSkill).toHaveBeenCalledWith(
        expect.objectContaining({
          variables: {
            skill: {
              cvId,
              name: ["React"],
            },
          },
        }),
      );

      expect(toast.promise).toHaveBeenCalled();
    });
  });

  describe("CV Core Management", () => {
    it("updateCv executes update mutation with input data", () => {
      const { result } = renderHook(() => useCvConstructor(cvId));

      const cvInput = {
        cvId,
        name: "Updated Name",
        description: "New Description",
        education: "University",
      } as unknown as IUpdateCvInput;

      act(() => {
        result.current.updateCv(cvInput);
      });

      act(() => {
        result.current.updateCv(cvInput);
      });

      expect(mockExecuteUpdateCv).toHaveBeenCalledWith({
        variables: { cv: cvInput },
      });

      expect(toast.promise).toHaveBeenCalled();
    });
  });
});
