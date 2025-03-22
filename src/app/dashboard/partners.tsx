"use client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import { User } from "@/app/actions/users";
import { Match } from "@/app/actions/getMatches";
import { setMatches } from "@/app/actions/createMatches";

interface FindPartnersProps {
	users: User[] | undefined;
	searchingLanguage: String | undefined | null;
	currentUser: User | undefined;
	matches: Match[] | undefined;
}

export default function FindPartners({
	users,
	searchingLanguage,
	currentUser,
	matches,
}: FindPartnersProps) {
	if (!users || users.length === 0) return null;

	const [expandedPartner, setExpandedPartner] = useState<string | null>(null);

	const [unsubscribeListener, setUnsubscribeListener] = useState<
		(() => void) | null
	>(null);

	const matchedUserIds = new Set(
		matches?.map((match) => match.users.map((user: any) => user.id))
	);

	console.log("Matched User Ids: " + matchedUserIds);

	const handleConnect = async (targetUser: User) => {
		const result = await setMatches({ currentUser, targetUser }, true);

		if (!result.success) {
			// TODO: Display a popup with the error message
			console.log("Error populating matches. " + targetUser.id);
		}
	};

	useEffect(() => {
		return () => {
			if (unsubscribeListener) {
				unsubscribeListener();
			}
		};
	}, [unsubscribeListener]);

	return (
		<div>
			<div>
				{/* TODO: Need to implement functionality to not display matches that have already been made */}
				{users
					.filter((user) => !matchedUserIds.has(user.id))
					.map((user) => (
						<div key={user.id}>
							{user.nativeLanguage == searchingLanguage &&
								user.email && (
									<div className="border b-4 flex flex-col mt-5 p-4 rounded-xl bg-zinc-50">
										<div className="flex flex-row space-x-4">
											<Avatar>
												<AvatarImage
													src="/placeholder.svg?height=40&width=40"
													alt="Test"
												/>
												<AvatarFallback>
													{user.name
														.split(" ")
														.map(
															(n: string) => n[0]
														)
														.join("")}
												</AvatarFallback>
											</Avatar>
											<div>
												<p className="font-bold baloo-2">
													{user.name}
												</p>
												<p className="text-sm text-gray-500">
													{user.nativeLanguage} →{" "}
													{user.languageLearning}
												</p>
											</div>
											<Button
												variant="ghost"
												onClick={() =>
													setExpandedPartner(
														expandedPartner ===
															user.id
															? null
															: user.id
													)
												}
											>
												{expandedPartner === user.id ? (
													<ChevronUp className="h-4 w-4" />
												) : (
													<ChevronDown className="h-4 w-4" />
												)}
											</Button>
										</div>
										{expandedPartner === user.id && (
											<div className="mt-4 space-y-2 text-sm text-gray-600">
												<p>
													<strong>Age:</strong>{" "}
													{user.age}
												</p>
												<p>
													<strong>Email:</strong>{" "}
													{user.email}
												</p>
												<p>
													<strong>
														Language Learning:
													</strong>{" "}
													{user.languageLearning}
												</p>
												<p>
													<strong>
														Native Language:
													</strong>{" "}
													{user.nativeLanguage}
												</p>
												<Button
													className="mt-2 bg-blue-600 hover:bg-blue-700"
													onClick={() =>
														handleConnect(user)
													}
												>
													Connect
												</Button>
											</div>
										)}
									</div>
								)}
						</div>
					))}
			</div>
		</div>
	);
}
