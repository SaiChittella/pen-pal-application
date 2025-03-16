"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Mic, Send, MoreVertical, ChevronLeft, Languages } from "lucide-react";
import { Search } from "lucide-react";
import Link from "next/link";

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

const messages = [
	{
		id: 1,
		sender: "Sophie Martin",
		content: "Bonjour! Comment ça va?",
		timestamp: "10:30 AM",
		isSent: false,
	},
	{
		id: 2,
		sender: "You",
		content: "Ça va bien, merci! Et toi?",
		timestamp: "10:32 AM",
		isSent: true,
	},
	{
		id: 3,
		sender: "Sophie Martin",
		content: "Je vais très bien aussi. Que fais-tu aujourd'hui?",
		timestamp: "10:33 AM",
		isSent: false,
	},
	{
		id: 4,
		sender: "You",
		content:
			"Je travaille sur un projet de programmation. C'est très intéressant!",
		timestamp: "10:35 AM",
		isSent: true,
	},
];

export default function ChatPage() {
	const [translateMode, setTranslateMode] = useState(false);

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
						<div
							key={partner.id}
							className="flex items-center space-x-4 mb-4 p-2 hover:bg-blue-200 rounded-lg cursor-pointer"
						>
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
					{messages.map((message) => (
						<div
							key={message.id}
							className={`flex ${
								message.isSent ? "justify-end" : "justify-start"
							}`}
						>
							{!message.isSent && (
								<div className="mr-2 relative top-14">
									<Avatar>
										<AvatarImage
											src={chatPartners[0].avatar}
											alt={chatPartners[0].name}
										/>
										<AvatarFallback>
											{chatPartners[0].name
												.split(" ")
												.map((n) => n[0])
												.join("")}
										</AvatarFallback>
									</Avatar>
								</div>
							)}
							<div
								className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl ${
									message.isSent
										? "bg-blue-500 text-white"
										: "bg-[#eeeff9]"
								} rounded-lg p-3 shadow`}
							>
								{!message.isSent && (
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
									{message.timestamp}
								</p>
							</div>
						</div>
					))}
				</div>

				<div className="flex flex-row space-x-1 items-center mb-5">
					<Input
						className="baloo-2 bg-[#eeeff9] items-center p-7"
						placeholder="Your message"
					/>
					<Button size="icon" variant="ghost">
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
