import { IMessage, useConversationStore } from "@/store/chat_store";

type ChatBubbleProps = {
	me: any;
	message: IMessage;
};

const ChatBubble = ({me,message}:ChatBubbleProps) => {
	const date = new Date(message._creationTime);
	const hour = date.getHours().toString().padStart(2, "0");
	const minute = date.getMinutes().toString().padStart(2, "0");
	const time = `${hour}:${minute}`

	const {selectedConversation} = useConversationStore()
	const isMember = selectedConversation?.participants.includes(message.sender._id) || false;
	const isGroup =selectedConversation?.isGroup;
	const fromMe =message.sender._id === me?._id;
	const bgClass = fromMe ? "bg-green-chat" : "bg-white dark:bg-gray-primary";
	if(!fromMe){
		return (
			<></>
		)
	}
	else{
		return (
			<></>
		)
	}
};
export default ChatBubble;