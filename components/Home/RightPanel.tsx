"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Video, X } from "lucide-react";
import MessageInput from "./MessageInput";
import MessageContainer from "./MessageContainer";
import ChatPlaceHolder from "./ChatPlaceHolder"
import GroupMembersDialog from "./GroupMembersDialog";
import { useConversationStore } from "@/store/chat_store";
import { useConvexAuth } from "convex/react";
import Header from "./Header";
import ChatListMb from "./ChatListMb";

const RightPanel = () => {
	const {selectedConversation, setSelectedConversation} = useConversationStore();
	const {isLoading} =useConvexAuth();
	if (isLoading) return null;
	if (!selectedConversation) return <ChatPlaceHolder />;

	const conversationName = selectedConversation.groupName || selectedConversation.name;
	const conversationImage = selectedConversation.groupImage || selectedConversation.image;

	return (
		<div className='w-full md:w-3/4 flex flex-col'>
			<div className='w-full sticky top-0 z-50'>
				<div className='flex justify-between bg-gray-primary p-3'>
					<div className='flex gap-3 items-center'>
						<ChatListMb/>
						<Avatar>
							<AvatarImage src={conversationImage || "/placeholder.png"} className='object-cover' />
							<AvatarFallback>
								<div className='animate-pulse bg-gray-tertiary w-full h-full rounded-full' />
							</AvatarFallback>
						</Avatar>
						<div className='flex flex-col'>
							<p>{conversationName}</p>
							{selectedConversation.isGroup && <GroupMembersDialog selectedConversation={selectedConversation}/>}
						</div>
					</div>

					<div className='flex items-center gap-7 mr-5'>
						<a href='/video-call' target='_blank'>
							<Video size={23} />
						</a>
						<X size={16} className='cursor-pointer' onClick={()=>setSelectedConversation(null)}/>
					</div>
				</div>
			</div>
			{/* CHAT MESSAGES */}
			<MessageContainer />

			{/* INPUT */}
			<MessageInput />
		</div>
	);
};
export default RightPanel;