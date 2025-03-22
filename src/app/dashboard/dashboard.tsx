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

interface DashboardUIProps {
	users: User[] | undefined;
	matches: Match[] | undefined;
}

export default function DashboardUI({ users, matches }: DashboardUIProps) {
	const [user] = useAuthState(auth);
	const router = useRouter();
	const [showNewPartners, setShowNewPartners] = useState(false);
	const [unsubscribeListener, setUnsubscribeListener] = useState<
		(() => void) | null
	>(null);

	if (!user) {
		router.push("/login");
	}

	const [currentUser, setCurrentUser] = useState<User>();

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

	useEffect(() => {
		return () => {
			if (unsubscribeListener) {
				unsubscribeListener();
			}
		};
	}, [unsubscribeListener]);

	return (
		<div className="min-h-screen bg-gray-100">
			<header className="bg-white shadow">
				<div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
					<h1 className="text-3xl font-bold Baloo-2 text-gray-900">
						Dashboard
					</h1>
					<div className="flex space-x-4">
						<Button variant="ghost">
							<Users className="mr-2 h-4 w-4" />
							<p className="Baloo-2">Find Partners</p>
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
										<TabsTrigger
											value="password"
											className="Baloo-2"
										>
											Password
										</TabsTrigger>
									</TabsList>

									<TabsContent value="account">
										<Card>
											<CardHeader>
												<CardTitle>Account</CardTitle>
												<CardDescription>
													Make changes to your account
													here. Click save when you're
													done.
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
													/>
												</div>
												<div className="space-y-1">
													<Label htmlFor="username">
														Username
													</Label>
													<Input
														id="username"
														defaultValue="@peduarte"
													/>
												</div>

												<div className="space-y-1 flex flex-col">
													<Label htmlFor="bio">
														Bio
													</Label>
													<textarea
														id="bio"
														placeholder="I am a..."
														className="border border-gray-200 px-2"
													/>
												</div>
											</CardContent>
											<CardFooter className="flex space-x-3">
												<Button className="bg-blue-500 hover:bg-blue-600 Baloo-2">
													Save changes
												</Button>
												<Button
													variant="destructive"
													className="Baloo-2"
												>
													Delete my account
												</Button>
											</CardFooter>
										</Card>
									</TabsContent>
									<TabsContent value="password">
										<Card>
											<CardHeader>
												<CardTitle>Password</CardTitle>
												<CardDescription>
													Change your password here.
													After saving, you'll be
													logged out.
												</CardDescription>
											</CardHeader>
											<CardContent className="space-y-2">
												<div className="space-y-1">
													<Label htmlFor="current">
														Current password
													</Label>
													<Input
														id="current"
														type="password"
													/>
												</div>
												<div className="space-y-1">
													<Label htmlFor="new">
														New password
													</Label>
													<Input
														id="new"
														type="password"
													/>
												</div>
											</CardContent>
											<CardFooter>
												<Button className="bg-blue-500 hover:bg-blue-600 Baloo-2">
													Save password
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
								/>
								{/* TODO: Have a default layout if there are no matches "No matches available..." */}
								<div className="space-y-4">
									{matches?.map((match) => (
										<Link
											href={`/chat/${match.id}`}
											key={
												match.users[0].id ==
												currentUser?.id
													? match.users[1].id
													: match.users[0].id
											}
											className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-100"
										>
											<Avatar>
												<AvatarImage
													src="/placeholder.svg?height=40&width=40"
													alt={match.users[0].name}
												/>
												<AvatarFallback>
													{(match.users[0].name ==
													currentUser?.name
														? match.users[1].name
														: match.users[0].name
													)
														.split(" ")
														.map(
															(n: string) => n[0]
														)
														.join("")}
												</AvatarFallback>
											</Avatar>
											<div className="flex-1 min-w-0">
												<p className="text-sm font-medium text-gray-900 truncate">
													{match.users[0].name ==
													currentUser?.name
														? match.users[1].name
														: match.users[0].name}
												</p>

												{/* TODO: Don't think this will correctly pull from the last message of the user */}
												<p className="text-sm text-gray-500 truncate">
													{match.lastMessage ||
														"No messages yet"}
												</p>
											</div>
											<MessageCircle className="h-5 w-5 text-gray-400" />
										</Link>
									))}
								</div>
							</CardContent>
						</Card>
						<Card className="w-2/3">
							<CardHeader>
								<CardTitle>
									<p className="font-bold Baloo-2 text-3xl">
										Welcome {currentUser?.name}!
									</p>
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-gray-600 Baloo-2">
									Remember to be respectful and patient with
									each other as you learn together.
								</p>
								<div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 ">
									<Button
										className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg"
										onClick={handleFindPartners}
									>
										<p className="Baloo-2">
											Find New Partners
										</p>
									</Button>
									<Button
										variant="outline"
										className="w-full"
									>
										<p className="Baloo-2">
											View Your Profile
										</p>
									</Button>
								</div>
								{showNewPartners ? (
									<FindPartners
										users={users}
										searchingLanguage={
											currentUser?.languageLearning
										}
										currentUser={currentUser}
										matches={matches}
									/>
								) : null}
							</CardContent>
						</Card>
					</div>

					<div className="mt-10">
						<Card className="p-5">
							<p className="font-bold baloo-2 text-3xl">
								Your Statistics
							</p>
						</Card>
					</div>
				</div>
			</main>
		</div>
	);
}
