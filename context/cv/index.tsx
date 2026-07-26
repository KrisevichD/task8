"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { ICVData } from "@/types/cv";

const initialData = {
  details: {
    name: "",
    description: "",
    education: "",
  },
  projects: [],
  skills: [],
} as ICVData;

export interface ICVContext {
  data: ICVData;
  updateDataByKey: <K extends keyof ICVData>(key: K, data: ICVData[K]) => void;
}

export const CVContext = createContext<ICVContext | null>(null);

export default function CVProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<ICVData>(initialData);

  const updateDataByKey = useCallback(
    <K extends keyof ICVData>(key: K, data: ICVData[K]) => {
      setData((prev) => ({
        ...prev,
        [key]: data,
      }));
    },
    [],
  );

  const value = useMemo(
    () => ({
      data,
      updateDataByKey,
    }),
    [data, updateDataByKey],
  );

  return <CVContext value={value}>{children}</CVContext>;
}

export function useCVContext() {
  const context = useContext(CVContext);
  if (!context) {
    throw new Error("use useCVContext inside provider component");
  }
  return context;
}
