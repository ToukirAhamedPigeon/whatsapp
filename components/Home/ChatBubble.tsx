import { MessageSeenSvg } from "@/lib/svgs";
import { IMessage, useConversationStore } from "@/store/chat_store";
import ChatBubbleAvatar from "./ChatBubbleAvatar";
import DateIndicator from "./DateIndicator";
import Image from "next/image";
import { useState } from "react";
import { Dialog, DialogDescription } from "@radix-ui/react-dialog";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import ReactPlayer from "react-player";
import ChatAvaterActions from "./ChatAvaterActions";
import { Bot } from "lucide-react";

type ChatBubbleProps = {
	me: any;
	message: IMessage;
	previousMessage?: IMessage;
};

const ChatBubble = ({me,message,previousMessage}:ChatBubbleProps) => {
	const date = new Date(message._creationTime);
	const hour = date.getHours().toString().padStart(2, "0");
	const minute = date.getMinutes().toString().padStart(2, "0");
	const time = `${hour}:${minute}`

	const {selectedConversation} = useConversationStore()
	const isMember = selectedConversation?.participants.includes(message.sender?._id) || false;
	const isGroup =selectedConversation!.isGroup;
	const fromMe =message.sender?._id === me?._id;
	const fromAI = message.sender?.name === "AI";
	const bgClass = fromMe ? "bg-green-chat" : !fromAI ? "bg-white dark:bg-gray-primary":"bg-blue-500 text-white";
	const [open, setOpen] = useState(false);

	const renderMessageContent = () => {
		switch (message.messageType) {
			case "text":
				return <TextMessage message={message} />;
			case "image":
				return <ImageMessage message={message} handleClick={()=> setOpen(true)}/>;
			case "video":
				return <VideoMessage message={message}/>;
			default:
				return null;
		}
	}
	if(!fromMe){
		return (
			<>
				<DateIndicator message={message} previousMessage={previousMessage}/>
				<div className="flex gap-1 w-4/5 md:w-2/3">
					<ChatBubbleAvatar isGroup={isGroup} isMember={isMember} message={message} fromAI={fromAI}/>
					<div className={`flex flex-col z-20 max-w-fit px-2 pt-1 rounded-md shadow-md relative ${bgClass}`}>
						{!fromAI && <OtherMessageIndicator/>}
						{fromAI && <Bot size={16} className="absolute bottom-[2px] left-2" />}
						{<ChatAvaterActions
							message={message}
							me={me}
						/>}
						{renderMessageContent()}
						{open && <ImageDialog src={message.content} open={open} onClose={()=> setOpen(false)}/>}
						<MessageTime time={time} fromMe={fromMe}/>
					</div>
				</div>
			</>
		)
	}
	else{
		return (
			<>
			<DateIndicator message={message} previousMessage={previousMessage}/>
			<div className="flex gap-1 w-4/5 md:w-2/3 ml-auto">
				<div className={`flex z-20 max-w-fit px-2 pt-1 rounded-md shadow-md ml-auto relative ${bgClass}`}>
					<SelfMessageIndicator/>
					{renderMessageContent()}
					{open && <ImageDialog src={message.content} open={open} onClose={()=> setOpen(false)}/>}
					<MessageTime time={time} fromMe={fromMe}/>
				</div>
			</div>
			</>
		)
	}
};
export default ChatBubble;

const VideoMessage = ({ message }: { message: IMessage }) => {
	return (
	  <div className="w-[100px] h-[80px] md:w-[250px] md:h-[180px] overflow-hidden rounded">
		<ReactPlayer
		  url={message.content}
		  width="100%"
		  height="100%"
		  controls
		  light
		/>
	  </div>
	);
  };

const ImageDialog = ({ src, open, onClose }: { src: string; open: boolean; onClose: () => void }) => {
	return (
	  <Dialog open={open} onOpenChange={(isOpen) => {
		if (!isOpen) onClose(); // Ensures state update on backdrop click or Escape
	  }}>
		<DialogContent className="md:min-w-[750px] bg-white dark:bg-gray-950">
		  <DialogTitle></DialogTitle>
		  <DialogDescription>
			<Image
			  src={src}
			  width={500}
			  height={800}
			  className="object-contain rounded-lg max-h-[80vh] w-auto mx-auto"
			  alt="image"
			/>
		  </DialogDescription>
		</DialogContent>
	  </Dialog>
	);
  };

const ImageMessage = ({message,handleClick}:{message:IMessage; handleClick: () =>void}) => {
	return (
		<div className="w-[100px] h-[100px] md:w-[250px] md:h-[250px] m-2 relative">
			<Image
				src={message.content}
				fill 
				className='cursor-pointer object-cover rounded'
				alt="image"
				onClick={handleClick}
			/>
		</div>
	)
}

const MessageTime = ({time,fromMe}:{time:string,fromMe:boolean}) => {
	return (
		<p className="text-[10px] mt-2 self-end flex gap-1 items-center">
			{time} {fromMe && <MessageSeenSvg/>}
		</p>
	)
}

const OtherMessageIndicator = () => {
	return (
		<div className="absolute bg-white dark:bg-gray-primary top-0 -left-[4px] w-3 h-3 rounded-bl-full"></div>
	)
}

const SelfMessageIndicator = () => {
	return (
		<div className="absolute bg-green-chat top-0 -right-[3px] w-3 h-3 rounded-br-full overflow-hidden"></div>
	)
}

const TextMessage = ({message}:{message:IMessage}) => {
	const isLink = /^(ftp|http|https):\/\/[^ "]+$/.test(message.content);
	return (
		<div>
			{isLink ? (
				<a 
				href={message.content}
				target="_blank"
				rel="noopener noreferrer"
				className={`mr-2 text-sm font-light text-blue-400 underline`}
				>{message.content}</a>
			):(
				<p className={`mr-2 text-sm font-light`}>{message.content}</p>
			)}
		</div>
	)
}