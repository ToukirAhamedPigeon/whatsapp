import React from 'react'
import { Menu, ListFilter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import SwitchTheme from "@/components/SwitchTheme";
import { UserButton } from "@clerk/nextjs";
import UserListDialog from "./UserListDialog";
import { useConvexAuth } from 'convex/react';
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
  } from "@/components/ui/sheet";
import ChatList from './ChatList';

const Headermb = () => {
  return (
    <div className='sticky top-0 bg-left-panel z-10 block md:hidden w-full'>
		{/* Header */}
		<div className='flex justify-between bg-gray-primary p-3 items-center'>
			
			<Sheet>
			<SheetTrigger>
				<Menu className="w-6 h-6 text-white" />
			</SheetTrigger>
			<SheetContent side="left" className="w-[90%] bg-white dark:bg-gray-800">
				<SheetTitle className='px-4 pt-4'>
					<HeaderTools/>
				</SheetTitle>
				<div className='w-full bg-gray-900'>
					<HeaderSearch/>
					<ChatList/>
				</div>
			</SheetContent>
			</Sheet>
			<HeaderTools userBtnPos='right'/>
		</div>
	</div>
  )
}

const HeaderTools= ({userBtnPos="left"}:{userBtnPos?:string}) => {
	const {isAuthenticated} = useConvexAuth()
	return (
		<div className='flex items-center gap-3'>
			{userBtnPos==="left" && <UserButton />}
			{isAuthenticated && <UserListDialog />}
			<SwitchTheme />
			{userBtnPos==="right" && <UserButton/>}
			{/* <LogOut size={20} className='cursor-pointer' /> */}
		</div>
	);
};

const HeaderSearch = () => {
	return (
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
	)
}

export default Headermb
