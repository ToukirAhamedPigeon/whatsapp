import { Laugh, Mic, Plus, Send } from "lucide-react";
import { Input } from "../ui/input";
import { useState } from "react";
import { Button } from "../ui/button";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useConversationStore } from "@/convex/store/chat_store";
import toast from "react-hot-toast";

const MessageInput = () => {
	const [msgText, setMsgText] = useState("");
	const sendTextMsg = useMutation(api.messages.sendTextMessage);
	const me = useQuery(api.users.getMe);
	const {selectedConversation} = useConversationStore()
	const handleSendTextMsg = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try{
			await sendTextMsg({
				conversation: selectedConversation!._id,
				sender: me!._id,
				content: msgText,
			})
			setMsgText("")
		}
		catch(err){
			toast.error("Something went wrong")
			console.log(err)
		}
	};
	return (
		<div className='bg-gray-primary p-2 flex gap-4 items-center'>
			<div className='relative flex gap-2 ml-2'>
				{/* EMOJI PICKER WILL GO HERE */}
				<Laugh className='text-gray-600 dark:text-gray-400' />
				<Plus className='text-gray-600 dark:text-gray-400' />
			</div>
			<form onSubmit={handleSendTextMsg} className='w-full flex gap-3'>
				<div className='flex-1'>
					<Input
						type='text'
						placeholder='Type a message'
						className='py-2 text-sm w-full rounded-lg bg-gray-tertiary focus-visible:ring-transparent border-slate-700 focus-within:border-slate-600 
                        active:border-slate-600 
                        focus-visible:border-slate-600 
                        shadow-none'
						value={msgText}
						onChange={(e) => setMsgText(e.target.value)}
					/>
				</div>
				<div className='mr-4 flex items-center gap-3'>
					{msgText.length > 0 ? (
						<Button
							type='submit'
							size={"sm"}
							className='bg-transparent text-foreground hover:bg-transparent'
						>
							<Send />
						</Button>
					) : (
						<Button
							type='submit'
							size={"sm"}
							className='bg-transparent text-foreground hover:bg-transparent'
						>
							<Mic />
						</Button>
					)}
				</div>
			</form>
		</div>
	);
};
export default MessageInput;