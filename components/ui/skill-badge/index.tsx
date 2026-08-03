import { TSkillMastery } from '@/types/skills';
import { cn } from '@/utils/shadcn';
import { cva } from 'class-variance-authority';
import React from 'react';

const skillBadgeVariants = cva(
    "w-19.5 h-1 relative",
{
    variants: {
      variant: {
        pressed: "bg-muted",
        Novice: "bg-mastery-bg-1",
        Advanced: "bg-mastery-bg-2",
        Competent: "bg-mastery-bg-3",
        Proficient: "bg-mastery-bg-4",
        Expert: "bg-primary",
      },
    },
    defaultVariants: {
      variant: "Novice",
    },
  },
);

const skillBarVariants = cva(
    "h-1 absolute top-0 left-0",
{
    variants: {
      variant: {
        pressed: "bg-transparent",
        Novice: "w-[20%] bg-mastery-1",
        Advanced: "w-[40%] bg-mastery-2",
        Competent: "w-[60%] bg-mastery-3",
        Proficient: "w-[80%] bg-mastery-4",
        Expert: "w-full bg-primary",
      },
    },
    defaultVariants: {
      variant: "Novice",
    },
  },
);

const SkillBadge = ({ variant }: { variant: TSkillMastery | "pressed"}) => {
    return (
        <div className={cn(skillBadgeVariants({ variant: variant }))}>
            <span aria-hidden className={cn(skillBarVariants({ variant: variant}))}></span>
            <span className='sr-only'>{variant}</span>
        </div>
    );
}

export default SkillBadge;
