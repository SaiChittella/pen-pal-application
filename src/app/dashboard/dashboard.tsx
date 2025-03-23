"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardFooter,
	CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Settings, Users } from "lucide-react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { User } from "@/app/actions/users";
import { Match } from "@/app/actions/getMatches";
import FindPartners from "@/app/dashboard/partners";
import { updateUserInDatabase } from "../actions/auth";
import { ChevronUp } from "lucide-react";

interface DashboardUIProps {
	users: User[];
	matches: Match[];
	messageCount: number;
}

export default function DashboardUI({
	users,
	matches,
	messageCount,
}: DashboardUIProps) {
	const [user] = useAuthState(auth);
	const router = useRouter();

	const [showNewPartners, setShowNewPartners] = useState(false);
	const [showProfile, setShowProfile] = useState(false);

	const [currentUser, setCurrentUser] = useState<User>({
		id: "",
		name: "",
		languageLearning: "",
		nativeLanguage: "",
		age: 0,
		email: "",
	});

	const [updateEmail, setupdateEmail] = useState("");
	const [updateName, setupdateName] = useState("");

	const [searchQuery, setSearchQuery] = useState("");


	const handleUpdates = async () => {
		const result = await updateUserInDatabase(
			currentUser,
			updateEmail,
			updateName
		);

		if (!result.success) {
			alert("Failed to update user information");
		}

		setupdateEmail("");
		setupdateName("");

		signOut(auth);
		sessionStorage.removeItem("user");
	};

	useEffect(() => {
		if (!user) {
			router.push("/login");
		}
	}, [user, router]);

	useEffect(() => {
		if (users && user) {
			const currentUserData = users.find((u) => u.email === user.email);
			if (currentUserData) {
				setCurrentUser(currentUserData);
			}
		}
	}, [users, user]);

	const handleFindPartners = () => {
		setShowNewPartners(true);
	};

	return (
		<div className="min-h-screen bg-gray-100">
			<header className="bg-white shadow">
				<div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
					<h1 className="text-3xl font-bold Baloo-2 text-gray-900">
						Dashboard
					</h1>
					<div className="flex space-x-4">
						<Button
							variant="ghost"
							onClick={() => setShowProfile(true)}
						>
							<Users className="mr-2 h-4 w-4" />
							<p className="Baloo-2">View Profile</p>
						</Button>

						<Popover>
							<PopoverTrigger className="flex items-center hover:bg-gray-100 px-5 rounded-lg hover:cursor-pointer">
								<Settings className="mr-2 h-4 w-4" />
								<p className="Baloo-2">Settings</p>
							</PopoverTrigger>
							<PopoverContent className="w-full  max-h-[80vh] overflow-y-auto">
								<Tabs defaultValue="account" className="w-full">
									<TabsList className="grid w-full grid-cols-2">
										<TabsTrigger
											value="account"
											className="Baloo-2"
										>
											Account
										</TabsTrigger>
									</TabsList>

									<TabsContent value="account">
										<Card>
											<CardHeader>
												<CardTitle>Account</CardTitle>
												<CardDescription className="max-w-1/2">
													Make changes to your account
													here. Click save when
													you&apos;re done. It will
													log you out.
												</CardDescription>
											</CardHeader>
											<CardContent className="space-y-3 flex flex-col">
												<div className="space-y-1">
													<Label htmlFor="name">
														Name
													</Label>
													<Input
														id="name"
														defaultValue="Pedro Duarte"
														onChange={(e) =>
															setupdateName(
																e.target.value
															)
														}
													/>
												</div>
												<div className="space-y-1">
													<Label htmlFor="username">
														Email
													</Label>
													<Input
														id="username"
														defaultValue="example@company.com"
														onChange={(e) =>
															setupdateEmail(
																e.target.value
															)
														}
													/>
												</div>
											</CardContent>
											<CardFooter className="flex space-x-3">
												<Button
													className="bg-blue-500 hover:bg-blue-600 Baloo-2"
													onClick={handleUpdates}
												>
													Save changes
												</Button>
											</CardFooter>
										</Card>
									</TabsContent>
								</Tabs>
							</PopoverContent>
						</Popover>

						<Button
							variant="destructive"
							onClick={() => {
								signOut(auth);
								sessionStorage.removeItem("user");
							}}
						>
							<p className="Baloo-2">Log out</p>
						</Button>
					</div>
				</div>
			</header>

			<main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
				<div className="px-4 py-6 sm:px-0">
					<div className="flex space-x-4">
						<Card className="w-1/3">
							<CardHeader>
								<CardTitle>
									<p className="font-bold Baloo-2 text-3xl">
										Your Matches
									</p>
								</CardTitle>
							</CardHeader>
							<CardContent>
								<Input
									placeholder="Search matches..."
									className="mb-4"
									value={searchQuery}
									onChange={(e) =>
										setSearchQuery(e.target.value)
									}
								/>

								<div className="space-y-4">
									{matches
										.filter((match) =>
											match.users.some((user: User) =>
												user.name
													.toLowerCase()
													.includes(
														searchQuery.toLowerCase()
													)
											)
										)
										.map((match, index) => (
											<Link
												href={`/chat/${match.id}`}
												key={index}
												className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-100"
											>
												<Avatar>
													<AvatarImage
														src="/placeholder.svg?height=40&width=40"
														alt={
															match.users[0].name
														}
													/>
													<AvatarFallback>
														{(match.users[0].name ==
														currentUser?.name
															? match.users[1]
																	.name
															: match.users[0]
																	.name
														)
															.split(" ")
															.map(
																(n: string) =>
																	n[0]
															)
															.join("")}
													</AvatarFallback>
												</Avatar>
												<div className="flex-1 min-w-0">
													<p className="text-sm font-medium text-gray-900 truncate">
														{match.users[0].name ==
														currentUser?.name
															? match.users[1]
																	.name
															: match.users[0]
																	.name}
													</p>
												</div>
												<MessageCircle className="h-5 w-5 text-gray-400" />
											</Link>
										))}
									{matches.length == 0 && (
										<p className="text-sm font-baloo2 text-center justify-center flex">
											No matches for you right now...
										</p>
									)}
								</div>
							</CardContent>
						</Card>
						<Card className="w-2/3">
							{!showProfile ? (
								<>
									<CardHeader>
										<CardTitle>
											<p className="font-bold Baloo-2 text-3xl">
												Welcome {currentUser?.name}!
											</p>
										</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="text-gray-600 Baloo-2">
											Remember to be respectful and
											patient with each other as you learn
											together.
										</p>
										<div className="mt-6">
											<Button
												className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg"
												onClick={handleFindPartners}
											>
												<p className="Baloo-2">
													Find New Partners
												</p>
											</Button>
										</div>
										{showNewPartners ? (
											<FindPartners
												users={users}
												searchingLanguage={
													currentUser?.languageLearning ||
													""
												}
												currentUser={currentUser}
												matches={matches}
											/>
										) : null}
									</CardContent>
								</>
							) : (
								<>
									<CardHeader className="flex flex-row items-center justify-between">
										<CardTitle>
											<p className="text-3xl font-baloo2 font-bold">
												Your Profile
											</p>
										</CardTitle>
										<Button
											variant="ghost"
											onClick={() =>
												setShowProfile(false)
											}
										>
											<ChevronUp className="h-4 w-4" />
										</Button>
									</CardHeader>
									<CardContent>
										<div className="flex flex-col md:flex-row gap-6">
											<div className="md:w-1/3">
												<div className="flex flex-col items-center text-center mb-6">
													<Avatar className="h-24 w-24 mb-4">
														<AvatarImage
															src={
																currentUser?.avatar
															}
															alt={
																currentUser?.name
															}
														/>
														<AvatarFallback>
															{currentUser?.name
																.split(" ")
																.map(
																	(n) => n[0]
																)
																.join("")}
														</AvatarFallback>
													</Avatar>
													<h2 className="text-xl font-bold">
														{currentUser?.name}
													</h2>
													<p className="text-sm text-gray-500 mt-1">
														{
															currentUser?.nativeLanguage
														}{" "}
														→{" "}
														{
															currentUser?.languageLearning
														}
													</p>
													<p className="text-sm text-gray-500 mt-1">
														Member since{" "}
														{
															currentUser?.memberSince
														}
													</p>
												</div>
											</div>

											<div className="md:w-2/3">
												<div className="bg-white p-4 rounded-lg shadow-sm mb-6">
													<h3 className="font-semibold mb-4 flex items-center">
														Learning Statistics
													</h3>

													<div className="grid grid-cols-2 gap-4 mb-6">
														<div className="bg-gray-50 p-3 rounded-lg text-center">
															<p className="text-3xl font-bold text-blue-500">
																{messageCount}
															</p>
															<p className="text-sm text-gray-600">
																Messages
															</p>
														</div>
														<div className="bg-gray-50 p-3 rounded-lg text-center">
															<p className="text-3xl font-bold text-blue-500">
																{
																	matches?.length
																}
															</p>
															<p className="text-sm text-gray-600">
																Language Buddies
															</p>
														</div>
													</div>
												</div>
											</div>
										</div>
									</CardContent>
								</>
							)}
						</Card>
					</div>
				</div>
			</main>
		</div>
	);
}
