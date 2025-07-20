import React, { useState } from 'react'
import { Menu} from "lucide-react";
import { ListFilter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
	Sheet,
	SheetContent,
	SheetTitle,
	SheetTrigger,
  } from "@/components/ui/sheet";
import ChatList from './ChatList';
import { HeaderTools } from './Headermb';

const ChatListMb = () => {
    const [open, setOpen] = useState(false);

  const handleConversationClick = () => {
    setOpen(false); // close the sheet
  };
  return (
    <div className="block md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Menu className="w-6 h-6 dark:text-white" />
            </SheetTrigger>
            <SheetContent side="left" className="w-[90%] bg-white dark:bg-gray-800 transition-all duration-300 ease-in-out z-50">
                <SheetTitle className='px-4 pt-4'>
                    <HeaderTools/>
                </SheetTitle>
                <div className='w-full bg-gray-900 pointer-events-auto'>
                    {/* <HeaderSearch/> */}
                    <ChatList onConversationClick={handleConversationClick}/>
                </div>
            </SheetContent>
        </Sheet>
    </div>
  )
}

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

export default ChatListMb
