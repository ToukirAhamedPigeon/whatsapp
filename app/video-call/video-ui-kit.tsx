"use client";

import { useEffect, useRef } from "react";
import { randomID } from "@/lib/utils";
import { useClerk } from "@clerk/nextjs";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

export function getUrlParams(url = window.location.href) {
	const urlStr = url.split("?")[1];
	return new URLSearchParams(urlStr);
}

export default function VideoUIKit() {
	const containerRef = useRef<HTMLDivElement>(null);
	const { user } = useClerk();
	const roomID = getUrlParams().get("roomID") || randomID(5);
	const joinedRef = useRef(false); // ✅ stable across renders

	useEffect(() => {
		if (!user || !containerRef.current || joinedRef.current) return;

		const initMeeting = async () => {
			try {
				const res = await fetch(`/api/zegocloud?userID=${user.id}`);
				const { token, appID } = await res.json();

				const username =
					user.fullName || user.emailAddresses[0].emailAddress.split("@")[0];

				const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
					appID,
					token,
					roomID,
					user.id,
					username
				);

				const zp = ZegoUIKitPrebuilt.create(kitToken);

				zp.joinRoom({
					container: containerRef.current,
					sharedLinks: [
						{
							name: "Personal link",
							url:
								window.location.protocol +
								"//" +
								window.location.host +
								window.location.pathname +
								"?roomID=" +
								roomID,
						},
					],
					scenario: {
						mode: ZegoUIKitPrebuilt.GroupCall,
					},
				});

				joinedRef.current = true; // ✅ Prevent second join
			} catch (err) {
				console.error("ZEGOCLOUD join error:", err);
			}
		};

		initMeeting();
	}, [user]);

	return (
		<div
			ref={containerRef}
			className="myCallContainer"
			style={{ width: "100vw", height: "100vh" }}
		></div>
	);
}
