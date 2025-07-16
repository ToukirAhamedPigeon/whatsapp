'use client'
import { useEffect, useRef, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { ImageIcon, Plus, Video } from "lucide-react";
import { Dialog, DialogContent, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import Image from "next/image";
import ReactPlayer from "react-player";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useConversationStore } from "@/store/chat_store";
import { DialogTitle } from "@radix-ui/react-dialog";

const MediaDropDown = () => {
    const imageInput = useRef<HTMLInputElement>(null);
    const videoInput = useRef<HTMLInputElement>(null);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const {selectedConversation} = useConversationStore();
    const generateUploadUrl = useMutation(api.conversations.generateUploadUrl);
    const me = useQuery(api.users.getMe);
    const sendImage = useMutation(api.messages.sendImage);
    const sendVideo= useMutation(api.messages.sendVideo);

    const handleSendImage = async () => {
    	setIsLoading(true);
        try{
            const postUrl = await generateUploadUrl();
            const result = await fetch(postUrl,{
                method:"POST",
                headers:{
                    "Content-Type": selectedImage!.type,
                },
                body:selectedImage
            })
            const {storageId} = await result.json();
            await sendImage({
            	conversation: selectedConversation!._id,
                imgId: storageId,
                sender: me!._id,
            })
            setSelectedImage(null);
        }
        catch(err){
        	toast.error("Failed to upload image");
        } finally{
            setIsLoading(false);
        }
    }

    const handleSendVideo = async () => {
    	setIsLoading(true);
        try{
        	const postUrl = await generateUploadUrl();
            const result = await fetch(postUrl,{
                method:"POST",
                headers:{
                    "Content-Type": selectedVideo!.type,
                },
                body: selectedVideo,
            })
            const {storageId} = await result.json();
            await sendVideo({
            	conversation: selectedConversation!._id,
                videoId: storageId,
                sender: me!._id,
            })
            setSelectedVideo(null);
        }
        catch(err){
        	toast.error("Failed to upload video");
        } finally{
            setIsLoading(false);
        }
    }

    return (
        <>
            <input type='file' ref={imageInput} accept='image/*' onChange={(e) => setSelectedImage(e.target.files![0])} hidden/>
            <input type='file' ref={videoInput} accept='video/mp4' onChange={(e) => setSelectedVideo(e.target.files![0])} hidden/>
            {selectedImage && (<MediaImageDialog isOpen={true} onClose={() => setSelectedImage(null)} selectedImage={selectedImage} isLoading={isLoading} handleSendImage={handleSendImage}/>)}
            {selectedVideo && (<MediaVideoDialog isOpen={selectedVideo !== null} onClose={() => setSelectedVideo(null)} selectedVideo={selectedVideo} isLoading={isLoading} handleSendVideo={handleSendVideo} />)}
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Plus className='cursor-pointer hover:border-none active:border-none'/>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='relative bg-white dark:bg-gray-800 w-[100px] left-8 shadow-md'>
                    <DropdownMenuItem onClick={()=> imageInput.current!.click()} className='flex flex-row cursor-pointer hover:border-none p-1 hover:bg-slate-200 hover:dark:bg-gray-700'>
                        <ImageIcon size={18} className='mr-1'/> Photo
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => videoInput.current!.click()} className='flex flex-row cursor-pointer hover:border-none p-1 hover:bg-slate-200 hover:dark:bg-gray-700'>
                        <Video size={20} className='mr-1'/> Video
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}
export default MediaDropDown;

type MediaImageDialogProps = {
	isOpen: boolean;
	onClose: () => void;
	selectedImage: File;
	isLoading: boolean;
	handleSendImage: () => void;
};

const MediaImageDialog = ({ isOpen, onClose, selectedImage, isLoading, handleSendImage }: MediaImageDialogProps) => {
	const [renderedImage, setRenderedImage] = useState<string | null>(null);

	useEffect(() => {
		if (!selectedImage) return;
		const reader = new FileReader();
		reader.onload = (e) => setRenderedImage(e.target?.result as string);
		reader.readAsDataURL(selectedImage);
	}, [selectedImage]);

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(isOpen) => {
				if (!isOpen) onClose();
			}}
		>
			<DialogContent className="bg-slate-100 dark:bg-gray-900">
                <DialogTitle></DialogTitle>
				<DialogDescription className='flex flex-col gap-10 justify-center items-center'>
					{renderedImage && <Image src={renderedImage} width={300} height={300} alt='selected image' />}
					<Button className='w-full dark:bg-white text-black cursor-pointer' disabled={isLoading} onClick={handleSendImage}>
						{isLoading ? "Sending..." : "Send"}
					</Button>
				</DialogDescription>
			</DialogContent>
		</Dialog>
	);
};

type MediaVideoDialogProps = {
	isOpen: boolean;
	onClose: () => void;
	selectedVideo: File;
	isLoading: boolean;
	handleSendVideo: () => void;
};

const MediaVideoDialog = ({ isOpen, onClose, selectedVideo, isLoading, handleSendVideo }: MediaVideoDialogProps) => {
	const renderedVideo = URL.createObjectURL(new Blob([selectedVideo], { type: "video/mp4" }));

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(isOpen) => {
				if (!isOpen) onClose();
			}}
		>
			<DialogContent className="bg-slate-100 dark:bg-gray-900">
                <DialogTitle></DialogTitle>
				<div className='w-full'>
                {renderedVideo && (
                    <ReactPlayer url={renderedVideo} controls width='100%' />
                    )}
				</div>
				<Button className='w-full dark:bg-white text-black cursor-pointer' disabled={isLoading} onClick={handleSendVideo}>
					{isLoading ? "Sending..." : "Send"}
				</Button>
			</DialogContent>
		</Dialog>
	);
};