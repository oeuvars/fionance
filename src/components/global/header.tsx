import { FC } from 'react'
import HeaderLogo from './header-logo'
import Navigation from './navigation'
import { UserButton, ClerkLoaded, ClerkLoading } from '@clerk/nextjs'
import { Skeleton } from '../ui/skeleton'
import WelcomeMessage from './welcome-message'

const Header: FC = () => {
  return (
    <header className='bg-gradient-to-b from-indigo-700 to-indigo-500 px-4 py-8 lg:px-14 pb-36'>
      <div className='max-w-screen-2xl mx-auto'>
         <div className='w-full flex items-center justify-between mb-14'>
            <div className='flex items-center lg:gap-x-16'>
               <HeaderLogo />
               <Navigation />
            </div>
            <ClerkLoading>
               <Skeleton className='size-8 rounded-full'/>
            </ClerkLoading>
            <ClerkLoaded>
               <UserButton afterSignOutUrl='/'/>
            </ClerkLoaded>
         </div>
         <WelcomeMessage />
      </div>
    </header>
  )
}

export default Header
