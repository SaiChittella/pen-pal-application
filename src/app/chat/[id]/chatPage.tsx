"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mic, Send, MoreVertical } from "lucide-react";
import Link from "next/link";
import { Message } from "@/app/_actions/getMessages";
import { User } from "@/app/_actions/users";
import { sendMessage } from "@/app/_actions/sendMessage";
import { ref, onChildAdded } from "firebase/database";
import { database } from "@/lib/firebase/config";

interface ChatPageProps {
	initialMessages: Message[];
	currentUser: User;
	receiverUser: User;
	id: string;
}

export default function ChatPageUI({
	initialMessages,
	currentUser,
	receiverUser,
	id,
}: ChatPageProps) {
	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState<Message[]>(initialMessages);

	useEffect(() => {
		const messagesRef = ref(database, `matches/${id}/messages`);

		const unsubscribe = onChildAdded(messagesRef, (snapshot) => {
			const newMessage = snapshot.val();
			setMessages((prevMessages) => [...prevMessages, newMessage]);
		});

		return () => unsubscribe();
	}, [id]);

	const handleSubmit = async () => {
		const result = await sendMessage(
			message,
			currentUser.name,
			currentUser.email,
			receiverUser.name,
			receiverUser.email,
			receiverUser.languageLearning,
			id
		);

		if (result.success) {
			setMessage("");
		} else {
			alert("Failed to send the message");
		}
	};

	return (
		<div className="flex h-screen bg-white px-4">
			<div className="flex-1 flex flex-col">
				<div className="bg-white  px-4 py-2 flex items-center justify-between">
					<div className="flex items-center space-x-4">
						<div>
							<h3 className="text-lg font-semibold baloo-2">
								{receiverUser.name}
							</h3>
							<p className="text-sm baloo-2 text-gray-500">
								Online
							</p>
						</div>
					</div>
					<div className="flex items-center space-x-2">
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
					{messages.map((message, index) => (
						<div
							key={index}
							className={`flex ${
								message.senderEmail == currentUser.email
									? "justify-end"
									: "justify-start"
							}`}
						>
							{message.senderEmail != currentUser.email && (
								<div className="mr-2 relative top-14">
									<Avatar>
										<AvatarImage alt={receiverUser.name} />
										<AvatarFallback>
											{receiverUser.name
												.split(" ")
												.map((n) => n[0])
												.join("")}
										</AvatarFallback>
									</Avatar>
								</div>
							)}
							<div
								className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl ${
									message.senderEmail == currentUser.email
										? "bg-blue-500 text-white"
										: "bg-[#eeeff9]"
								} rounded-lg p-3 shadow`}
							>
								{message.senderEmail != currentUser.email && (
									<div>
										<p className="text-md mb-2 text-blue-600 font-bold baloo-2">
											{message.sender}
										</p>
									</div>
								)}
								<p className="text-sm baloo-2">
									{currentUser.email == message.senderEmail
										? message.senderTranslation
										: message.receiverTranslation}
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
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								e.preventDefault();
								handleSubmit();
							}
						}}
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
