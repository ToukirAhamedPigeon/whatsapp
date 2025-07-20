import React from 'react'
import SwitchTheme from "@/components/SwitchTheme";
import { UserButton } from "@clerk/nextjs";
import UserListDialog from "./UserListDialog";
import { useConvexAuth } from 'convex/react';
import ChatListMb from './ChatListMb';

const Headermb = () => {
  return (
    <div className='sticky top-0 bg-left-panel z-10 block md:hidden w-full'>
		{/* Header */}
		<div className='flex justify-between bg-gray-primary p-3 items-center'>	
			<ChatListMb/>
			<HeaderTools userBtnPos='right'/>
		</div>
	</div>
  )
}

export const HeaderTools= ({userBtnPos="left"}:{userBtnPos?:string}) => {
	const {isAuthenticated} = useConvexAuth()
	return (
		<div className='flex items-center gap-3'>
			{userBtnPos==="left" && <UserButton appearance={{
          elements: { userButtonPopoverCard: { pointerEvents: "initial" } },
        }}/>}
			{isAuthenticated && <UserListDialog />}
			<SwitchTheme />
			{userBtnPos==="right" && <UserButton/>}
			{/* <LogOut size={20} className='cursor-pointer' /> */}
		</div>
	);
};

export default Headermb
