import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FloatingInput } from "@/components/ui/floating-input";
import { FloatingSelect } from "@/components/ui/floating-select";
import { Icon } from "@/components/ui/icon";
import { SelectItem } from "@/components/ui/select";

import { useLazyQuery, useQuery } from '@apollo/client/react';
import { GET_ALL_SKILLS, GET_SKILLS_CATEGORIES } from '@/graphql/skills';
import { ISkillData, ISkillForm } from '@/types/cv';
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useCVContext } from "@/context/cv";

const CVSkillsForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [executeFetch, { data, loading, error }] = useLazyQuery(GET_ALL_SKILLS, {fetchPolicy: "network-only"});
  const isError = error !== undefined;
  const { data: contextData, updateDataByKey} = useCVContext();
  const { handleSubmit, control, reset } = useForm<ISkillForm>({
    defaultValues: {
      name: "",
      mastery: "Beginner"
    }
  });

  useEffect(() => {
    if (error && error.message) {
      toast.error(error.message, { position: "top-right" })
    }
  }, [error]);

  useEffect(() => {
    if (isOpen) {
      executeFetch();
    }
  }, [isOpen])

  const onSubmit = (formData: ISkillForm) => {
    console.log(">>>"+formData)
    if (!data) return;
    const skill = data.skills.find(e => e.name === formData.name);
    updateDataByKey('skills', [...contextData.skills, {...skill!, mastery: formData.mastery}]);
    setIsOpen(false);
    reset();
  }

  const isInContext = (name: string) => contextData.skills.some(e => e.name === name)

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger render={
          <Button variant={'ghost'}>
            <Icon variant="add" />
            ADD SKILL
          </Button>
        } />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add skill</DialogTitle>
          </DialogHeader>
          <form id="cv-skill-form" className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
            <Controller
            name="name"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <FloatingSelect 
                label="Skill" 
                value={field.value} 
                onValueChange={field.onChange}
                disabled={loading || isError}
              >
                {data?.skills.filter(e => !isInContext(e.name)).map((skill) => (
                  <SelectItem key={"cv-skill-select-" + skill.id} value={skill.name}>
                    {skill.name}
                  </SelectItem>
                ))}
              </FloatingSelect>
            )}
          />

          <Controller
            name="mastery"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <FloatingSelect 
                label="Skill mastery" 
                value={field.value} 
                onValueChange={field.onChange} 
                disabled={loading || isError}
              >
                <SelectItem value={'Beginner'}>Beginner</SelectItem>
                <SelectItem value={'Novice'}>Novice</SelectItem>
                <SelectItem value={'Intermediate'}>Intermediate</SelectItem>
                <SelectItem value={'Proficient'}>Proficient</SelectItem>
                <SelectItem value={'Expert'}>Expert</SelectItem>
              </FloatingSelect>
            )}
          />
          </form>
          <DialogFooter>
            <DialogClose render={
              <Button variant={'outline'}>CANCEL</Button>
            } />
            <Button variant={'primary'} type="submit" disabled={loading || isError} form="cv-skill-form">ADD</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
};

export default CVSkillsForm;
