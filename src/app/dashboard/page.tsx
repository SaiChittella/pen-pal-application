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

export default function Dashboard() {
	const matches = [
		{
			id: 1,
			name: "Sophie Martin",
			lastMessage: "Bonjour! Comment ça va?",
			avatar: "/placeholder.svg?height=40&width=40",
		},
		{
			id: 2,
			name: "Pierre Dubois",
			lastMessage: "Je suis débutant en anglais.",
			avatar: "/placeholder.svg?height=40&width=40",
		},
		{
			id: 3,
			name: "Marie Leclerc",
			lastMessage: "Merci pour votre aide!",
			avatar: "/placeholder.svg?height=40&width=40",
		},
	];

	return (
		<div className="min-h-screen bg-gray-100">
			<header className="bg-white shadow">
				<div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
					<h1 className="text-3xl font-bold baloo-2 text-gray-900">
						Dashboard
					</h1>
					<div className="flex space-x-4">
						<Button variant="ghost">
							<Users className="mr-2 h-4 w-4" />
							<p className="baloo-2">Find Partners</p>
						</Button>

						<Popover>
							<PopoverTrigger className="flex items-center hover:bg-gray-100 px-5 rounded-lg hover:cursor-pointer">
								<Settings className="mr-2 h-4 w-4" />
								<p className="baloo-2">Settings</p>
							</PopoverTrigger>
							<PopoverContent className="w-full  max-h-[80vh] overflow-y-auto">
								<Tabs defaultValue="account" className="w-full">
									<TabsList className="grid w-full grid-cols-2">
										<TabsTrigger
											value="account"
											className="baloo-2"
										>
											Account
										</TabsTrigger>
										<TabsTrigger
											value="password"
											className="baloo-2"
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
												<Button className="bg-blue-500 hover:bg-blue-600 baloo-2">
													Save changes
												</Button>
												<Button
													variant="destructive"
													className="baloo-2"
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
												<Button className="bg-blue-500 hover:bg-blue-600 baloo-2">
													Save password
												</Button>
											</CardFooter>
										</Card>
									</TabsContent>
								</Tabs>
							</PopoverContent>
						</Popover>

						<Button variant="destructive">
							<p className="baloo-2">Log out</p>
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
									<p className="font-bold baloo-2 text-3xl">
										Your Matches
									</p>
								</CardTitle>
							</CardHeader>
							<CardContent>
								<Input
									placeholder="Search matches..."
									className="mb-4"
								/>
								<div className="space-y-4">
									{matches.map((match) => (
										<Link
											// href={`/chat/${match.id}`}
											href="/chat"
											key={match.id}
											className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-100"
										>
											<Avatar>
												<AvatarImage
													src={match.avatar}
													alt={match.name}
												/>
												<AvatarFallback>
													{match.name
														.split(" ")
														.map((n) => n[0])
														.join("")}
												</AvatarFallback>
											</Avatar>
											<div className="flex-1 min-w-0">
												<p className="text-sm font-medium text-gray-900 truncate">
													{match.name}
												</p>
												<p className="text-sm text-gray-500 truncate">
													{match.lastMessage}
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
									<p className="font-bold baloo-2 text-3xl">
										Welcome to Pen Pal!
									</p>
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-gray-600 baloo-2">
									Start chatting with your language partners
									to improve your skills. Remember to be
									respectful and patient with each other as
									you learn together.
								</p>
								<div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 ">
									<Button className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg">
										<p className="baloo-2">
											Find New Partners
										</p>
									</Button>
									<Button
										variant="outline"
										className="w-full"
									>
										<p className="baloo-2">
											View Your Profile
										</p>
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>

					<div className="mt-10">
						<Card className="p-5">
							<p className="font-bold baloo-2 text-3xl">Your Statistics</p>
						</Card>
					</div>
				</div>
			</main>
		</div>
	);
}
