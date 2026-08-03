"use client";

import { Controller } from "react-hook-form";

import { AvatarSection } from "./AvatarSection";

import { Button } from "@/components/ui/button";
import { FloatingInput } from "@/components/ui/floating-input";
import { FloatingSelect } from "@/components/ui/floating-select";
import { SelectItem } from "@/components/ui/select";
import { IUserData } from "@/graphql/user/queries";

import { useEmployeeDetailsForm } from "@/hooks/employees/useEmployeeDetailsForm";
interface IEmployeeDetailsContentProps {
  userId: string;
  initialUser?: IUserData;
  isLoading?: boolean;
}

export const EmployeeDetailsContent = ({
  userId,
  initialUser,
  isLoading: isUserLoading,
}: IEmployeeDetailsContentProps) => {
  const user = initialUser;

  const {
    form,
    isOwner,
    departments,
    positions,
    avatarPreview,
    isUpdating,
    canSubmit,
    handleAvatarChange,
    onSubmit,
  } = useEmployeeDetailsForm(userId, user);

  if (isUserLoading) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-8 text-center text-destructive">User not found</div>
    );
  }

  const initials =
    `${user.profile?.first_name?.[0] || ""}${user.profile?.last_name?.[0] || ""}`.toUpperCase() ||
    "U";

  const formattedDate = user.created_at
    ? new Date(Number(user.created_at) || user.created_at).toDateString()
    : "Sun Jan 14 2024";

  return (
    <div className="flex flex-col items-center space-y-8 w-full max-w-225 mx-auto px-6 pt-4 pb-12">
      <AvatarSection
        avatarUrl={user.profile?.avatar}
        avatarPreview={avatarPreview}
        firstName={user.profile?.first_name}
        initials={initials}
        isOwner={isOwner}
        onAvatarChange={handleAvatarChange}
      />

      <div className="text-center space-y-1">
        <h2 className="text-2xl font-normal text-foreground">
          {user.profile?.first_name} {user.profile?.last_name}
        </h2>
        <p className="text-sm text-muted-foreground">{user.email}</p>
        <p className="text-xs text-muted-foreground pt-1">
          A member since {formattedDate}
        </p>
      </div>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-6 pt-2"
      >
        <div className="grid grid-cols-2 gap-6">
          <FloatingInput
            id="firstName"
            label="First Name"
            disabled={!isOwner}
            {...form.register("firstName", { required: true })}
          />
          <FloatingInput
            id="lastName"
            label="Last Name"
            disabled={!isOwner}
            {...form.register("lastName", { required: true })}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Controller
            control={form.control}
            name="departmentId"
            rules={{ required: true }}
            render={({ field }) => (
              <FloatingSelect
                label="Department"
                value={field.value || ""}
                onValueChange={field.onChange}
                disabled={!isOwner}
              >
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.name}>
                    {dept.name}
                  </SelectItem>
                ))}
              </FloatingSelect>
            )}
          />

          <Controller
            control={form.control}
            name="positionId"
            rules={{ required: true }}
            render={({ field }) => (
              <FloatingSelect
                label="Position"
                value={field.value || ""}
                onValueChange={field.onChange}
                disabled={!isOwner}
              >
                {positions.map((pos) => (
                  <SelectItem key={pos.id} value={pos.name}>
                    {pos.name}
                  </SelectItem>
                ))}
              </FloatingSelect>
            )}
          />
        </div>

        {isOwner && (
          <div className="pt-4 flex justify-end">
            <Button
              type="submit"
              disabled={!canSubmit || isUpdating}
              className={`w-full max-w-90 h-12 rounded-full font-semibold text-sm tracking-wider uppercase transition-colors ${
                canSubmit
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                  : "bg-border text-muted-foreground cursor-not-allowed opacity-100"
              }`}
            >
              {isUpdating ? "UPDATING..." : "UPDATE"}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};
