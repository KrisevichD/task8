import { cn } from "@/utils/shadcn";

interface IUserSkeletonProps {
  className?: string;
}

export const UserSkeleton = ({ className }: IUserSkeletonProps) => {
  return (
    <div
      className={cn(
        "flex items-center gap-3 animate-pulse select-none",
        className
      )}
    >
      <div className="size-10 rounded-full bg-muted shrink-0" />

      <div className="h-4 w-24 rounded bg-muted shrink-0" />
    </div>
  );
};