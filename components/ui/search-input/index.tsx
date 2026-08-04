"use client";

import { Icon } from "@/components/ui/icon";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useLanguage } from "@/context/language";

interface ISearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchInput = ({
  value,
  onChange,
  placeholder,
  className = "w-[320px]",
}: ISearchInputProps) => {
  const { t } = useLanguage();

  return (
    <div className={className}>
      <InputGroup variant="search" className="h-10 bg-secondary/30">
        <InputGroupAddon align="inline-start">
          <Icon
            variant="search"
            size="default"
            className="text-muted-foreground"
          />
        </InputGroupAddon>
        <InputGroupInput
          placeholder={placeholder || t("search")}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </InputGroup>
    </div>
  );
};
