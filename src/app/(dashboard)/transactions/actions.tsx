"use client"

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useConfirm } from "../../../hooks/use-confirm";
import { TrashIcon } from "@radix-ui/react-icons";
import { useDeleteTransaction } from "../../../features/transactions/api/use-delete-transaction";
import { useOpenTransaction } from "../../../features/transactions/hooks/use-open-transactions";
import { IconDots, IconPencil } from "@tabler/icons-react";

type Props = {
   id: string;
}

export const Actions = ({ id }: Props) => {
   const [ConfirmationDialog, confirm] = useConfirm(
      "Are you sure?",
      "You are about to delete this transaction"
   )
   const deleteMutation = useDeleteTransaction(id);
   const { onOpen } = useOpenTransaction();
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
                  <IconDots className="size-5"/>
               </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white/5 backdrop-blur-md">
               <DropdownMenuItem disabled={deleteMutation.isPending} onClick={() => onOpen(id)} className="mx-auto">
                  <IconPencil className="size-5 mr-2 my-auto" />
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
