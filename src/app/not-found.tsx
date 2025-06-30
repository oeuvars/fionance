"use client"

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import HeaderLogo from '@/components/global/header-logo'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-700 to-indigo-500">
      <div className="px-4 py-8 lg:px-14">
        <div className="max-w-screen-2xl mx-auto">
          <div className="w-full flex items-center justify-between mb-14">
            <HeaderLogo />
          </div>
          
          <div className="flex flex-col items-center justify-center text-center min-h-[60vh]">
            <div className="mb-8">
              <h1 className="text-6xl lg:text-8xl font-bold text-white mb-4">404</h1>
              <h2 className="text-2xl lg:text-4xl text-white font-medium mb-4">
                Page Not Found
              </h2>
              <p className="text-sm lg:text-base text-[#89b6fd] mb-8 max-w-md">
                Sorry, we couldn&apos;t find the page you&apos;re looking for. The page might have been moved, deleted, or you entered the wrong URL.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/">
                <Button className="bg-white text-indigo-700 hover:bg-white/90 font-medium px-6 py-2">
                  Go Back Home
                </Button>
              </Link>
              <Button 
                variant="outline" 
                className="border-white/20 text-white hover:bg-white/10 hover:text-white bg-transparent font-medium px-6 py-2"
                onClick={() => window.history.back()}
              >
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound
