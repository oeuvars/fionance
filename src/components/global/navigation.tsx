"use client"

import { usePathname, useRouter } from "next/navigation"
import { FC, useState } from "react"
import NavButton from "./nav-button"
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet"
import { IconMenu } from "@tabler/icons-react"
import { Button } from "../ui/button"
import { useMediaQuery } from "@/hooks/use-media-query"

const routes = [
   {
      href: "/",
      label: "Dashboard"
   },
   {
      href: "/transactions",
      label: "Transactions"
   },
   {
      href: "/accounts",
      label: "Accounts"
   },
   {
      href: "/categories",
      label: "Categories"
   },
   {
      href: "/settings",
      label: "Settings"
   }
]

export const Navigation: FC = () => {
   const pathname = usePathname();
   const [isOpen, setIsOpen] = useState<boolean>(false);
   const router =useRouter();
   const isMobile = useMediaQuery('(max-width: 1024px)');

   const onClick = (href: string) => {
      router.push(href);
      setIsOpen(false);
   }

   if (isMobile) {
      return (
         <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
               <button className="px-3 py-1.5 rounded-lg font-normal bg-white/10 hover:bg-white border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-white focus:bg-white/30 transition">
                  <IconMenu className="size-6"/>
               </button>
            </SheetTrigger>
            <SheetContent side="left" className="px-2 bg-white/30 backdrop-blur-2xl border-none">
               <nav className="flex flex-col gap-y-2 pt-6">
                  {routes.map((route) => (
                     <Button key={route.href} variant={route.href === pathname ? "default" : "ghost"} onClick={() => onClick(route.href)} className="w-full justify-start">
                        {route.label}
                     </Button>
                  ))}
               </nav>
            </SheetContent>
         </Sheet>
      )
   }
   return (
      <nav className="hidden lg:flex items-center gap-x-2 overflow-x-auto">
         {routes.map((route, index) => (
            <NavButton key={index} href={route.href} label={route.label} isActive={pathname === route.href}/>
         ))}
      </nav>
   )
}