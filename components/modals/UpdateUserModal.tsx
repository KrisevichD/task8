"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export interface IUpdateUserFormValues {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  departmentId: string;
  positionId: string;
  role: string;
}

interface IUpdateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any | null;
  departments?: Array<{ id: string; name: string }>;
  positions?: Array<{ id: string; name: string }>;
  onUpdate: (values: IUpdateUserFormValues) => Promise<void>;
  isLoading?: boolean;
}

export const UpdateUserModal = ({
  isOpen,
  onClose,
  user,
  departments = [],
  positions = [],
  onUpdate,
  isLoading,
}: IUpdateUserModalProps) => {
  const { register, handleSubmit, reset } = useForm<IUpdateUserFormValues>();

  // Подтягиваем данные выбранного сотрудника в инпуты
  useEffect(() => {
    if (user) {
      reset({
        userId: user.id || "",
        email: user.email || "",
        firstName: user.firstName || user.profile?.first_name || "",
        lastName: user.lastName || user.profile?.last_name || "",
        departmentId: user.departmentId || user.department || "",
        positionId: user.positionId || user.position || "",
        role: user.role || "Employee",
      });
    }
  }, [user, reset]);

  const onSubmit = async (values: IUpdateUserFormValues) => {
    await onUpdate(values);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* sm:max-w-[860px] — делает модалку широкой как на макете Figma */}
      <DialogContent className="sm:max-w-[860px] w-full bg-background text-foreground p-8 rounded-2xl shadow-xl border border-border">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-2xl font-semibold text-foreground">
            Update user
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-2">
          {/* Ряд 1: Email & Password (Disabled) */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label
                htmlFor="modal-email"
                className="text-xs font-medium text-muted-foreground"
              >
                Email
              </label>
              <Input
                {...register("email")}
                id="modal-email"
                disabled
                className="h-12 bg-muted/40 text-muted-foreground border-input cursor-not-allowed"
              />
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="modal-password"
                className="text-xs font-medium text-muted-foreground"
              >
                Password
              </label>
              <Input
                id="modal-password"
                type="password"
                value="************"
                disabled
                className="h-12 bg-muted/40 text-muted-foreground border-input cursor-not-allowed"
              />
            </div>
          </div>

          {/* Ряд 2: First Name & Last Name (Active) */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label
                htmlFor="modal-first-name"
                className="text-xs font-medium text-foreground"
              >
                First Name
              </label>
              <Input
                {...register("firstName")}
                id="modal-first-name"
                placeholder="First Name"
                className="h-12 bg-background border-input text-foreground focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="modal-last-name"
                className="text-xs font-medium text-foreground"
              >
                Last Name
              </label>
              <Input
                {...register("lastName")}
                id="modal-last-name"
                placeholder="Last Name"
                className="h-12 bg-background border-input text-foreground focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Ряд 3: Department & Position (Active Dropdowns) */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label
                htmlFor="modal-department"
                className="text-xs font-medium text-foreground"
              >
                Department
              </label>
              <select
                {...register("departmentId")}
                id="modal-department"
                className="w-full h-12 px-3.5 rounded-md bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
              >
                <option value="">Select Department</option>
                {departments.map((dep) => (
                  <option key={dep.id} value={dep.id}>
                    {dep.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="modal-position"
                className="text-xs font-medium text-foreground"
              >
                Position
              </label>
              <select
                {...register("positionId")}
                id="modal-position"
                className="w-full h-12 px-3.5 rounded-md bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
              >
                <option value="">Select Position</option>
                {positions.map((pos) => (
                  <option key={pos.id} value={pos.id}>
                    {pos.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Ряд 4: Role (Disabled) */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label
                htmlFor="modal-role"
                className="text-xs font-medium text-muted-foreground"
              >
                Role
              </label>
              <Input
                {...register("role")}
                id="modal-role"
                disabled
                className="h-12 bg-muted/40 text-muted-foreground border-input cursor-not-allowed"
              />
            </div>
          </div>

          <DialogFooter className="pt-6 flex justify-end items-center gap-4  mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-full px-10 h-12 border-input text-foreground hover:bg-accent font-medium text-sm min-w-[150px]"
            >
              CANCEL
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="rounded-full px-10 h-12 bg-muted-foreground/20 text-foreground hover:bg-muted-foreground/30 font-medium text-sm min-w-[150px]"
            >
              {isLoading ? "UPDATING..." : "UPDATE"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
