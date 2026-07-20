import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import EyeSvg from "@/public/eye.svg"
import DotsSvg from "@/public/dots.svg"
import SearchSvg from "@/public/add.svg"
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FloatingInput } from "@/components/ui/floating-input";
import { FloatingSelect } from "@/components/ui/floating-select";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center ">
      <main className=" flex tra flex-1 w-full max-w-3xl border-none flex-col bg-background items-center justify-between py-32 px-16  sm:items-start">


        <Dialog>
          <DialogTrigger render={<Button variant={'ghost'}><SearchSvg /> ADD</Button>} />
          <DialogContent className={'w-[60vw] max-w-[90vw] sm:max-w-[90vw]'}>
            <DialogHeader>
              <DialogTitle>Update language</DialogTitle>
            </DialogHeader>
            <Select disabled>
              <SelectTrigger>
                <SelectValue placeholder="English" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Fruits</SelectLabel>
                  <SelectItem value="apple">English</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Language proficiency" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="A1">A1</SelectItem>
                  <SelectItem value="A2">A2</SelectItem>
                  <SelectItem value="B1">B1</SelectItem>
                  <SelectItem value="B2">B2</SelectItem>
                  <SelectItem value="native">native</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <DialogFooter>
              <DialogClose render={<Button variant={'outline'}>CANCEL</Button>} />
              <Button variant={'primary'}>CONFIRM</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Input variant={'search'} className="w-80" />
        <InputGroup variant={'search'} className="w-80">
          <InputGroupInput type="text" disabled />
          <InputGroupAddon align={'inline-start'}>
            <Button variant={'ghost'} size={'icon-xs'}><SearchSvg /></Button>
          </InputGroupAddon>
        </InputGroup>
        <Field>
          <FieldLabel htmlFor="name">NAME</FieldLabel>
          <Input id="name" type="text" />
        </Field>
        <InputGroup>
          <InputGroupInput type="password" placeholder="Password" />
          <InputGroupAddon align={'inline-end'}>
            <Button variant={'ghost'} size={'icon'}><EyeSvg /></Button>
          </InputGroupAddon>
        </InputGroup>
        <Badge>calkjdla</Badge>
        <Badge variant={'outline'}>calkjdla</Badge>
        <FloatingInput label={'Language'}/>
        <FloatingSelect label="Language">
          <SelectItem value={1}>1</SelectItem>
          <SelectItem value={2}>2</SelectItem>
          <SelectItem value={3}>3</SelectItem>
        </FloatingSelect>
        <Separator />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink>CVs</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbPage>Software Engineer with 5+ years of experience</BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbLink>Projects</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Button variant={'secondary'} size={'icon'}><DotsSvg className={'text-foreground'} /></Button>
        <div className="flex gap-1 flex-wrap">
          <Button variant={'primary'}>ВОЙТИ</Button>
          <Button variant={'ghost'}>У МЕНЯ ЕСТЬ АККАУНТ</Button>
          <Button variant={'outline'}>CANCEL</Button>
          <Button variant={'secondary'}>UPDATE</Button>
          <Button variant={'outlinePrimary'} size={'xs'}>EXPORT PDF</Button>
        </div>
        <Tabs defaultValue={1}>
          <TabsList>
            <TabsTrigger value={1}>PROFILE</TabsTrigger>
            <TabsTrigger value={2}>SKILLS</TabsTrigger>
          </TabsList>
          <TabsContent value={1}>
            <Input type="file" />
          </TabsContent>
          <TabsContent value={2}>
            2
          </TabsContent>
        </Tabs>
        <Textarea />

      <Avatar>
        <AvatarImage
          src="https://github.com/shadcn.png"
          alt="@shadcn"
          className="grayscale"
        />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      </main>
    </div>
  );
}
