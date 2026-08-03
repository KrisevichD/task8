import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Icon } from "@/components/ui/icon";

interface IAvatarSectionProps {
  avatarUrl?: string;
  avatarPreview: string | null;
  firstName?: string;
  initials: string;
  isOwner: boolean;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AvatarSection = ({
  avatarUrl,
  avatarPreview,
  firstName,
  initials,
  isOwner,
  onAvatarChange,
}: IAvatarSectionProps) => {
  return (
    <div className="flex items-center gap-8">
      <Avatar className="size-30">
        <AvatarImage src={avatarPreview || avatarUrl} alt={firstName} />
        <AvatarFallback className="bg-muted text-foreground text-4xl font-normal">
          {initials}
        </AvatarFallback>
      </Avatar>

      {isOwner && (
        <label className="flex flex-col cursor-pointer group select-none">
          <input
            type="file"
            accept="image/png, image/jpeg, image/gif"
            onChange={onAvatarChange}
            className="hidden"
          />

          <div className="flex items-center gap-3 text-foreground font-medium text-[20px] leading-8 tracking-[0.15px] group-hover:text-primary transition-colors">
            <Icon variant="upload" size="default" className="shrink-0" />
            <span>Upload avatar image</span>
          </div>

          <span className="text-foreground/70 font-normal text-[16px] leading-7 tracking-[0.15px]">
            png, jpg or gif no more than 0.5MB
          </span>
        </label>
      )}
    </div>
  );
};
