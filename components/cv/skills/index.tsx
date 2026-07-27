import React, { useState } from 'react';

import CVSkillsForm from './form';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { useCVContext } from '@/context/cv';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import SkillBadge from '@/components/ui/skill-badge';
import { Toggle } from '@/components/ui/toggle';
import { Badge } from '@/components/ui/badge';

const CVSkills = () => {
    const { data, updateDataByKey } = useCVContext();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

    const clearSkillContext = () => {
        updateDataByKey('skills', []);
        setIsOpen(false)
    }

    const deletePressedSkills = () => {
        selectedSkills.forEach((skill) => {
            updateDataByKey('skills', data.skills.filter(e => e.name !== skill))
        })
        setSelectedSkills([])
    }

    const handleToggle = (name: string, isPressed: boolean) => {
        setSelectedSkills((prev) => {
            if (isPressed) {
                return [...prev, name];
            } else {
                return prev.filter((e) => e !== name);
            }
        });
    }

    const filteredCategories: string[] = [...data.skills]
        .sort((a, b) => a.category.id - b.category.id)
        .map(e => e.category.name)
        .filter((e, i, arr) => arr.indexOf(e) === i);
    console.log(filteredCategories)

    const filteredList = filteredCategories.map(e => ({ name: e, list: data.skills.filter(skill => skill.category.name === e) }))
    console.log(filteredList)

    return (
        <div className='pl-6 pt-8 ml-42.25 mr-42.75'>
            {filteredList.map(category => {
                return (
                    <>
                        <h2 className='text-[16px]'>
                            {category.name}
                        </h2>
                        {category.list.map(skill => {
                            const isPressed = selectedSkills.includes(skill.name)

                            return (
                                <Toggle
                                    key={"cv-skill-" + skill.id}
                                    variant={'ghost'}
                                    pressed={isPressed}
                                    onPressedChange={(pressed) => handleToggle(skill.name, pressed)}
                                    className='w-71 h-12'
                                >
                                    <SkillBadge variant={skill.mastery} />
                                    {skill.name}
                                </Toggle>)
                        })
                        }
                    </>
                )
            })}


            <div className='flex justify-end w-fill'>
                <CVSkillsForm />

                {selectedSkills.length > 0
                    ?
                    <Button variant={'primary'} onClick={deletePressedSkills}>
                        DELETE
                        <Badge className='bg-primary-foreground text-primary font-bold'>{selectedSkills.length}</Badge>
                    </Button>
                    :
                    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                        <AlertDialogTrigger render={
                            <Button variant={'ghost'} className={'text-primary hover:text-primary'} disabled={data.skills.length <= 0}>
                                <Icon variant='delete' />
                                REMOVE SKILLS
                            </Button>
                        } />
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will clear list of skills.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={clearSkillContext}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                }
            </div>
        </div>
    );
}

export default CVSkills;
