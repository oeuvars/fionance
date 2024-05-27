"use client"

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react";
import { Image } from "@nextui-org/image";
import { useConfirm } from "../../../../hooks/use-confirm";
import { TrashIcon } from "@radix-ui/react-icons";
import { useDeleteCategory } from "../../../../features/categories/api/use-delete-category";
import { useOpenCategory } from "../../../../features/categories/hooks/use-open-category";

type Props = {
   id: string;
}

export const Actions = ({ id }: Props) => {
   const [ConfirmationDialog, confirm] = useConfirm(
      "Are you sure?",
      "You are about to delete this category"
   )
   const deleteMutation = useDeleteCategory(id);
   const { onOpen } = useOpenCategory();
   const handleDelete = async () => {
      const ok = await confirm();

      if (ok) {
         deleteMutation.mutate()
      }
   }
   return (
      <>
         <ConfirmationDialog />
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button className="size-8 p-0" variant="ghost">
                  <MoreHorizontal className="size-5"/>
               </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white/5 backdrop-blur-md">
               <DropdownMenuItem disabled={deleteMutation.isPending} onClick={() => onOpen(id)} className="mx-auto">
                  <Image src="/edit.svg" radius="none" className="size-5 mr-2 my-auto" />
                  <p className="text-base">Edit</p>
               </DropdownMenuItem>
               <DropdownMenuItem disabled={deleteMutation.isPending} onClick={handleDelete} className="mx-auto">
                  <TrashIcon className="size-5 mr-2" />
                  <p className="text-base">Delete</p>
               </DropdownMenuItem>
            </DropdownMenuContent>
         </DropdownMenu>
      </>
   )
}
