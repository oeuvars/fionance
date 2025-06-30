import { ReactNode, Suspense } from 'react'
import { IconLoader } from "@tabler/icons-react"
import { Metadata } from 'next';

type Props = {
   children: ReactNode
}

export const metadata: Metadata = {
  title: "Fionance - Login",
  description: "Login to Fionance to track your personal finances and manage your budget.",
  keywords: [
    "Fionance",
    "login",
    "personal finance",
    "budget tracking",
    "expense management",
    "financial planning",
  ],
  openGraph: {
    title: "Fionance - Login",
    description: "Login to Fionance to track your personal finances and manage your budget.",
    url: 'http://localhost:3000/sign-in',
    siteName: 'Fionance',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: "Fionance - Login",
    description: "Login to Fionance to track your personal finances and manage your budget.",
  },
};

const Layout = ({ children }: Props) => {
  return (
    <Suspense fallback={
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <IconLoader className="animate-spin size-10 text-zinc-700" strokeWidth={1.5}/>
      </div>
    }>
      <main className='flex justify-center items-center'>
         {children}
      </main>
    </Suspense>
  )
}

export default Layout
