"use client";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";

const SwitchTheme = () => {
	const { setTheme } = useTheme();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild className='bg-transparent relative border-none'>
				<Button variant='outline' size='icon' className="cursor-pointer">
					<SunIcon className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
					<MoonIcon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
					<span className='sr-only'>Toggle theme</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end' className='bg-gray-primary border-slate-600'>
				<DropdownMenuItem className="cursor-pointer" onClick={() => setTheme("light")}>Light</DropdownMenuItem>
				<DropdownMenuItem className="cursor-pointer" onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
				<DropdownMenuItem className="cursor-pointer" onClick={() => setTheme("system")}>System</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
export default SwitchTheme;