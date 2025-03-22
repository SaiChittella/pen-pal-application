"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mic, Send, MoreVertical, Languages } from "lucide-react";
import { Search } from "lucide-react";
import Link from "next/link";
import { Message } from "@/app/actions/getMessages";
import { User } from "@/app/actions/users";
import { sendMessage } from "@/app/actions/sendMessage";

const chatPartners = [
	{
		id: 1,
		name: "Sophie Martin",
		avatar: "/placeholder.svg?height=40&width=40",
		lastMessage: "Bonjour! Comment ça va?",
	},
	{
		id: 2,
		name: "Pierre Dubois",
		avatar: "/placeholder.svg?height=40&width=40",
		lastMessage: "Je suis débutant en anglais.",
	},
	{
		id: 3,
		name: "Marie Leclerc",
		avatar: "/placeholder.svg?height=40&width=40",
		lastMessage: "Merci pour votre aide!",
	},
];

interface ChatPageProps {
	messages: Message[] | undefined;
	currentUser: User | undefined;
	receiverUser: User | undefined;
	id: string;
}

export default function ChatPageUI({
	messages,
	currentUser,
	receiverUser,
	id,
}: ChatPageProps) {
	const [translateMode, setTranslateMode] = useState(false);

	const [message, setMessage] = useState("");

	const handleSubmit = async () => {
		const result = await sendMessage(
			message,
			currentUser?.name,
			currentUser?.email,
			receiverUser?.name,
			receiverUser?.email,
			id
		);

		if (result.success) {
			setMessage("");
		} else {
			console.error("Failed to send the message");
		}
	};

	return (
		<div className="flex h-screen bg-white">
			<div className="w-1/4 bg-white border-r border-gray-100 overflow-y-auto">
				<div className="p-4">
					<div className="flex">
						<Search className="z-30 w-7 h-7 absolute top-5  px-1" />
						<Input
							className="mb-4 bg-[#eeeff9] baloo-2 z-20 px-7 rounded-xl"
							placeholder="Search"
						/>
					</div>
					{chatPartners.map((partner) => (
						<Link href={`/chat/${partner.id}`} key={partner.id}>
							<div className="flex items-center space-x-4 mb-4 p-2 hover:bg-blue-200 rounded-lg cursor-pointer">
								<Avatar>
									<AvatarImage
										src={partner.avatar}
										alt={partner.name}
									/>
									<AvatarFallback>
										{partner.name
											.split(" ")
											.map((n) => n[0])
											.join("")}
									</AvatarFallback>
								</Avatar>
								<div className="flex-1 min-w-0">
									<p className="text-md baloo-2 font-bold text-gray-900 truncate">
										{partner.name}
									</p>
									<p className="text-sm baloo-2 text-gray-500 truncate">
										{partner.lastMessage}
									</p>
								</div>
							</div>
						</Link>
					))}
				</div>
			</div>

			<div className="flex-1 flex flex-col">
				<div className="bg-white  px-4 py-2 flex items-center justify-between">
					<div className="flex items-center space-x-4">
						<div>
							<h3 className="text-lg font-semibold baloo-2">
								{chatPartners[0].name}
							</h3>
							<p className="text-sm baloo-2 text-gray-500">
								Online
							</p>
						</div>
					</div>
					<div className="flex items-center space-x-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => setTranslateMode(!translateMode)}
							className={
								translateMode ? "bg-blue-100 text-blue-600" : ""
							}
						>
							<Languages className="h-4 w-4 mr-2" />
							{translateMode
								? "Translation On"
								: "Translation Off"}
						</Button>
						<Link
							className="bg-blue-500 p-1 rounded-lg text-white font-bold px-4 hover:bg-blue-600"
							href="/dashboard"
						>
							Back
						</Link>
						<Button variant="ghost" size="icon">
							<MoreVertical className="h-6 w-6" />
						</Button>
					</div>
				</div>

				<div className="flex-1 overflow-y-auto p-4 space-y-4">
					{messages?.map((message) => (
						<div
							key={message.id}
							className={`flex ${
								message.senderEmail == currentUser?.email
									? "justify-end"
									: "justify-start"
							}`}
						>
							{message.senderEmail != currentUser?.email && (
								<div className="mr-2 relative top-14">
									<Avatar>
										<AvatarImage alt={receiverUser?.name} />
										<AvatarFallback>
											{receiverUser?.name
												.split(" ")
												.map((n) => n[0])
												.join("")}
										</AvatarFallback>
									</Avatar>
								</div>
							)}
							<div
								className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl ${
									message.senderEmail == currentUser?.email
										? "bg-blue-500 text-white"
										: "bg-[#eeeff9]"
								} rounded-lg p-3 shadow`}
							>
								{message.senderEmail != currentUser?.email && (
									<div>
										<p className="text-md mb-2 text-blue-600 font-bold baloo-2">
											{message.sender}
										</p>
									</div>
								)}

								<p className="text-sm baloo-2">
									{message.content}
								</p>
								<p className="text-xs text-right mt-1 opacity-70 baloo-2">
									{new Date(
										message.timestamp
									).toLocaleString()}
								</p>
							</div>
						</div>
					))}
				</div>

				<div className="flex flex-row space-x-1 items-center mb-5">
					<Input
						className="baloo-2 bg-[#eeeff9] items-center p-7"
						placeholder="Your message"
						value={message}
						onChange={(e) => setMessage(e.target.value)}
					/>
					<Button size="icon" variant="ghost" onClick={handleSubmit}>
						<Send className="h-8 w-8 text-blue-500" />
					</Button>
					<Button variant="ghost" size="icon">
						<Mic className="h-8 w-8 text-blue-500" />
					</Button>
				</div>
			</div>
		</div>
	);
}
