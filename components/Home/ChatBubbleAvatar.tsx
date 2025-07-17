import { IMessage } from '@/store/chat_store';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import React from 'react'

type ChatBubbleAvatarProps = {
  isMember: boolean;
  message: IMessage;
  isGroup: boolean;
  fromAI: boolean;
};

const ChatBubbleAvatar = ({isGroup,isMember,message,fromAI}:ChatBubbleAvatarProps) => {
  if(!isGroup && !fromAI) return null;
  return (
    <Avatar className="overflow-visible relative">
        {message.sender.isOnline && isMember && (
            <div className='absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full border-2 border-foreground'></div>
        )}
        {!fromAI && <AvatarImage
          src={message.sender?.image}
          className="w-8 h-8 rounded-full object-cover aspect-square"
        />}
        {fromAI && <AvatarImage
          src={message.sender?.image}
          className="w-21 h-8 rounded-full object-cover aspect-square"
        />}
        <AvatarFallback className='w-8 h-8'>
            <div className='animate-pulse bg-gray-tertiary rounded-full'></div>
        </AvatarFallback>
    </Avatar>
  )
}

export default ChatBubbleAvatar
