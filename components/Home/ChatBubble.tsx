import { IMessage } from "@/store/chat_store";

type ChatBubbleProps = {
	me: any;
	message: IMessage;
};

const ChatBubble = ({me,message}:ChatBubbleProps) => {
	return <div>ChatBubble</div>;
};
export default ChatBubble;