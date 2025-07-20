import React from 'react'
import { ListFilter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import SwitchTheme from "@/components/SwitchTheme";
import { UserButton } from "@clerk/nextjs";
import UserListDialog from "./UserListDialog";
import { useConvexAuth } from 'convex/react';

const Header = () => {
    const {isAuthenticated} = useConvexAuth()
  return (
    <div className='sticky top-0 bg-left-panel z-10 hidden md:block'>
				{/* Header */}
				<div className='flex justify-between bg-gray-primary p-3 items-center'>
					<UserButton/>

					<div className='flex items-center gap-3'>
						{isAuthenticated && <UserListDialog />}
						<SwitchTheme />
						{/* <LogOut size={20} className='cursor-pointer' /> */}
					</div>
				</div>
				<div className='p-3 flex items-center'>
					{/* Search */}
					<div className='relative h-10 mx-3 flex-1'>
						<Search
							className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 z-10'
							size={18}
						/>
						<Input
							type='text'
							placeholder='Search or start a new chat'
							className='pl-10 py-2 text-sm w-full rounded shadow-sm !bg-gray-primary focus-visible:ring-transparent border-none'
						/>
					</div>
					<ListFilter className='cursor-pointer' />
				</div>
			</div>
  )
}

export default Header
