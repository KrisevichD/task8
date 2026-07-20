import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FloatingInput } from "@/components/ui/floating-input";
import { FloatingSelect } from "@/components/ui/floating-select";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center ">
      <main className=" flex tra flex-1 w-full max-w-3xl border-none flex-col bg-background items-center justify-between py-32 px-16  sm:items-start">
        <Dialog>
          <DialogTrigger
            render={
              <Button variant={"ghost"}>
                <Icon variant="add" /> ADD
              </Button>
            }
          />
          <DialogContent className={"w-[60vw] max-w-[90vw] sm:max-w-[90vw]"}>
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
              <DialogClose
                render={<Button variant={"outline"}>CANCEL</Button>}
              />
              <Button variant={"primary"}>CONFIRM</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Input variant={"search"} className="w-80" />
        <InputGroup variant={"search"} className="w-80">
          <InputGroupInput type="text" />
          <InputGroupAddon align={"inline-start"}>
            <Button variant={"ghost"} size={"icon-sm"}>
              <Icon variant="search" />
            </Button>
          </InputGroupAddon>
        </InputGroup>

        <InputGroup>
          <InputGroupInput type="password" />
          <InputGroupAddon align={"inline-end"}>
            <Button variant={"ghost"} size={"icon"}>
              <Icon variant="eye" />
            </Button>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupInput type="password" label="Password" />
          <InputGroupAddon align={"inline-end"}>
            <Button variant={"ghost"} size={"icon"}>
              <Icon variant="eye" />
            </Button>
          </InputGroupAddon>
        </InputGroup>
        <Badge>calkjdla</Badge>
        <Badge variant={"outline"}>calkjdla</Badge>
        <FloatingInput label={"Language"} />
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
              <BreadcrumbPage>
                Software Engineer with 5+ years of experience
              </BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbLink>Projects</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Button variant={"secondary"} size={"icon"}>
          <Icon variant="dots" className={"text-foreground"} />
        </Button>
        <div className="flex flex-wrap">
          <Button variant={"primary"}>ВОЙТИ</Button>
          <Button variant={"primary"} disabled>
            ВОЙТИ
          </Button>
          <Button variant={"ghost"}>У МЕНЯ ЕСТЬ АККАУНТ</Button>
          <Button variant={"outline"}>CANCEL</Button>
          <Button variant={"secondary"}>UPDATE</Button>
          <Button variant={"outlinePrimary"} size={"xs"}>
            EXPORT PDF
          </Button>
        </div>
        <Tabs defaultValue={1}>
          <TabsList>
            <TabsTrigger value={1}>PROFILE</TabsTrigger>
            <TabsTrigger value={2}>SKILLS</TabsTrigger>
          </TabsList>
          <TabsContent value={1}>
            <Input type="file" />
          </TabsContent>
          <TabsContent value={2}>2</TabsContent>
        </Tabs>
        <Textarea />

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>First Name</TableHead>
              <TableHead>Last Name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <Avatar>
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                    className="grayscale"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell>Rostislav</TableCell>
              <TableCell>Harlanov</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </main>
    </div>
  );
}
