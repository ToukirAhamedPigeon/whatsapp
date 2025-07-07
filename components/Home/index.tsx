"use client"

import React from 'react'
import LeftPanel from './LeftPanel'
import RightPanel from './RightPanel'
import { Authenticated, Unauthenticated } from 'convex/react'
import { SignInButton } from '@clerk/nextjs'
import { Button } from '../ui/button'

const Home = () => {
  return (
    <>
    <Authenticated>
      <main className="m-5">
        <div className="flex overflow-y-hidden h-[calc(100vh-50px)] max-w-[1700px] mx-auto bg-left-panel">
          <div className="fixed top-0 left-0 w-full h-36 bg-green-primary dark:bg-transparent -z-30"/>
          <LeftPanel/>
          <RightPanel/>
        </div>
      </main>
    </Authenticated>
    <Unauthenticated>
      <div className='flex flex-col items-center justify-center h-screen space-y-10'>
        <h1 className='text-green-700 font-bold text-3xl'>Welcome to Pigeonic WhatsApp</h1>
        <Button asChild variant="default" className='bg-green-700 hover:bg-green-600 text-white cursor-pointer'><SignInButton /></Button>
      </div>
    </Unauthenticated>
    </>
  )
}

export default Home
