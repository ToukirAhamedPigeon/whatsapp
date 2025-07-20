import React from 'react'
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";
import { useConversationStore } from "@/store/chat_store";
import {useConvexAuth, useQuery} from "convex/react"
import Conversation from "./Conversation";

const ChatList = ({ onConversationClick }: { onConversationClick?: () => void }) => {
    const {isAuthenticated, } = useConvexAuth()
    const conversations = useQuery(api.conversations.getMyConversations, isAuthenticated ? undefined: "skip");
	const {selectedConversation,setSelectedConversation} = useConversationStore()
	useEffect(() => {
		const convesationIds = conversations?.map((conversation)=>conversation._id);
		if(selectedConversation && convesationIds && !convesationIds?.includes(selectedConversation._id)){
			setSelectedConversation(null)
		}
	}, [conversations, selectedConversation, setSelectedConversation])
  return (
        <div className='my-3 flex flex-col gap-0 max-h-[80%] overflow-auto'>
            {conversations?.map((conversation)=>(
                <Conversation key={conversation._id} conversation={conversation} onClick={onConversationClick}/>
            ))}

            {conversations?.length === 0 && (
                <>
                    <p className='text-center text-gray-500 text-sm mt-3'>No conversations yet</p>
                    <p className='text-center text-gray-500 text-sm mt-3 '>
                        We understand {"you're"} an introvert, but {"you've"} got to start somewhere 😊
                    </p>
                </>
            )}
        </div>
  )
}

export default ChatList
