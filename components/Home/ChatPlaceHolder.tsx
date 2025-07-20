import { Lock } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import Headermb from "./Headermb";

const ChatPlaceHolder = () => {
	return (
		<>
			<div className='w-full md:w-3/4 bg-gray-secondary flex flex-col items-center justify-center pb-10'>
				<Headermb/>
				<div className='flex flex-col items-center w-full justify-center py-10 gap-4'>
					<Image src={"/desktop-hero.png"} alt='Hero' width={320} height={188} />
					<p className='text-4xl font-extralight mt-5 mb-2'>Chat AI</p>
					<p className='w-4/5 md:w-1/2 text-center text-gray-primary text-sm text-muted-foreground'>
						Make calls, share your screen and get GenAI as third person in your chat.
					</p>
				</div>
				<p className='w-1/2 mt-auto text-center text-gray-primary text-xs text-muted-foreground flex items-center justify-center gap-1'>
					Developed by  <Link href="https://pigeonic.com"><span className="text-[14px] font-bold text-red-700 cursor-pointer">Pigeonic</span></Link>
				</p>
			</div>
		</>
	);
};
export default ChatPlaceHolder;