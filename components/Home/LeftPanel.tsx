
import {useConvexAuth} from "convex/react"

import Header from "./Header";
import ChatList from "./ChatList";

const LeftPanel = () => {
	const {isLoading} = useConvexAuth()
	

	if(isLoading) return null;
	return (
		<div className='w-0 md:w-1/4 border-gray-600 border-r'>
			<Header/>
			<ChatList/>
		</div>
	);
};
export default LeftPanel;