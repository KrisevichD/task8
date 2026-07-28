"use client";

import { Icon } from "@/components/ui/icon";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

interface IEmployeeSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export const EmployeeSearch = ({ value, onChange }: IEmployeeSearchProps) => {
  return (
    <div className="w-[320px]">
      <InputGroup variant="search" className="h-10 bg-secondary/30">
        <InputGroupAddon align="inline-start">
          <Icon
            variant="search"
            size="default"
            className="text-muted-foreground"
          />
        </InputGroupAddon>
        <InputGroupInput
          placeholder="Search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </InputGroup>
    </div>
  );
};
