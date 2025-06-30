"use client"

import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IconUser, IconLogout2, IconLogin2, IconShoppingBag } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/button';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

type Props = {
   name: string | undefined,
   image: string | null | undefined | undefined;
   isInSession: boolean
};

const UserButton = ({ name, image, isInSession }: Props) => {
   const getInitials = (name: string) => {
      const nameParts = name.split('');
      return nameParts
         .map(part => part[0])
         .join('')
         .toUpperCase()
         .slice(0, 2);
   };
   const router = useRouter();

   const handleAuth = async () => {
      if (isInSession) {
         await authClient.signOut({
            fetchOptions: {
               onSuccess: () => {
                  router.push('/');
               },
            }
         })
      } else {
         router.push('/sign-in')
      }

   }

   return (
      <DropdownMenu modal={false}>
         <DropdownMenuTrigger asChild>
            <div className='my-auto cursor-pointer transition-all duration-300 hover:shadow-md hover:shadow-primary/25 rounded-full'>
               {isInSession ? (
               <>
                  {image ? (
                     <Image
                        src={image}
                        alt={name || ''}
                        width={40}
                        height={40}
                        className="rounded-full hover:opacity-90 transition-opacity"
                     />
                  ) : name ? (
                     <div className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center text-white text-sm font-semibold transition-transform hover:scale-105">
                        {getInitials(name)}
                     </div>
                  ) : (
                     <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center transition-transform hover:scale-105">
                        <span className="text-gray-500">User</span>
                     </div>
                  )}
               </>
               ) : (
               <Button className='transition-all duration-300 hover:shadow-md hover:shadow-primary/25 hover:brightness-110' variant="secondary">
                  Sign in
               </Button>
               )}
            </div>
         </DropdownMenuTrigger>
         <DropdownMenuContent className='mr-3 mt-4 w-60 border-dashed bg-white/50 backdrop-blur-xl'>
            <DropdownMenuLabel>
               Hey, {name ? <>{name}</> : <>My Profile</>}!
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
               <IconUser />
               Profile
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
               <Link href="/cart">
                  <IconShoppingBag />
                  Cart
               </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleAuth}>
               {isInSession ? (
                  <div className='flex gap-2'>
                     <IconLogout2 className='size-4 my-auto' />
                     Sign Out
                  </div>
               ) : (
                  <div className='flex gap-2'>
                     <IconLogin2 className='size-4 my-auto' />
                     Sign In
                  </div>
               )}
            </DropdownMenuItem>
         </DropdownMenuContent>
      </DropdownMenu>
   );
};

export default UserButton;
