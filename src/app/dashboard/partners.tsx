"use client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { User } from "@/app/_actions/users";
import { Match } from "@/app/_actions/getMatches";
import { setMatches } from "@/app/_actions/createMatches";

interface FindPartnersProps {
	users: User[];
	searchingLanguage: string;
	currentUser: User;
	matches: Match[];
}

export default function FindPartners({
	users,
	searchingLanguage,
	currentUser,
	matches,
}: FindPartnersProps) {
	const [expandedPartner, setExpandedPartner] = useState<string | null>(null);

	if (!users || users.length === 0) return null;

	const matchedUserIds = new Set(
		matches?.flatMap((match) => match.users.map((user: User) => user.id))
	);

	const handleConnect = async (targetUser: User) => {
		const result = await setMatches({ currentUser, targetUser }, true);

		if (!result.success) {
			console.log("Error populating matches. " + targetUser.id);
		}
	};

	return (
		<div>
			<div>
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
