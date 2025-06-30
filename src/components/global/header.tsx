"use client";

import { FC } from 'react'
import HeaderLogo from './header-logo'
import { Button } from '../ui/button'
import { Skeleton } from '../ui/skeleton'
import { useSession, signOut } from '@/lib/auth-client'
import { IconLogout, IconUser } from '@tabler/icons-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { WelcomeMessage } from './welcome-message';
import { Navigation } from './navigation';

const UserButtonComponent: FC = () => {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return <Skeleton className='size-8 rounded-full'/>;
  }

  if (!session?.user) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = '/';
        }
      }
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={session.user.image || ''} alt={session.user.name || ''} />
            <AvatarFallback>
              <IconUser className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuItem onClick={handleSignOut}>
          <IconLogout className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Header: FC = () => {
  return (
    <header className='bg-gradient-to-b from-indigo-700 to-indigo-500 px-4 py-8 lg:px-14 pb-36'>
      <div className='max-w-screen-2xl mx-auto'>
         <div className='w-full flex items-center justify-between mb-14'>
            <div className='flex items-center lg:gap-x-16'>
               <HeaderLogo />
               <Navigation />
            </div>
            <UserButtonComponent />
         </div>
         <WelcomeMessage />
      </div>
    </header>
  )
}

export default Header