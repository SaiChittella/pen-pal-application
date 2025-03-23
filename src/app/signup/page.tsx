"use client";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Globe } from "lucide-react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { createUserInDatabase } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	SelectGroup,
	SelectLabel,
} from "@/components/ui/select";

export default function SignupPage() {
	const [email, setEmail] = useState("");
	const [name, setName] = useState("");
	const [age, setAge] = useState("");
	const [nativeLanguage, setNativeLanguage] = useState("");
	const [languageLearning, setLanguageLearning] = useState("");
	const [password, setPassword] = useState("");

	const [createUserWithEmailAndPassword] =
		useCreateUserWithEmailAndPassword(auth);

	const router = useRouter();

	const handleSignUp = async () => {
		try {
			if (!email.trim() || !email.includes("@")) {
				alert("Please enter a valid email address.");
				return;
			}

			if (
				email.length == 0 ||
				name.length == 0 ||
				password.length == 0 ||
				languageLearning === "" ||
				nativeLanguage == ""
			) {
				alert("Please fill out all the fields!");
				return;
			}

			await createUserWithEmailAndPassword(email, password);
			sessionStorage.setItem("user", "true");

			const result = await createUserInDatabase({
				email,
				name,
				age,
				nativeLanguage,
				languageLearning,
			});

			if (result.success) {
				setEmail("");
				setPassword("");
				setName("");
				setAge("");
				setNativeLanguage("");
				setLanguageLearning("");

				router.push("/login");
			} else {
				alert("Failed to create user in database");
			}
		} catch (e) {
			alert("Something went wrong: " + e);
		}
	};

	return (
		<div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
			<div className="w-full max-w-md space-y-8">
				<div className="text-center">
					<Globe className="mx-auto h-12 w-12 text-blue-600" />
					<h2 className="mt-6 text-3xl font-extrabold text-gray-900">
						Create your account!
					</h2>
					<p className="mt-2 text-sm text-gray-600 Baloo-2">
						Sign up to start your language journey today
					</p>
				</div>

				<Card className="mt-8 shadow-lg border-t-4 border-blue-600">
					<CardContent className="space-y-4 pt-6">
						<div className="space-y-2">
							<Input
								type="name"
								placeholder="Full Name"
								className="rounded-lg"
								onChange={(e) => setName(e.target.value)}
							/>
						</div>

						<div className="space-y-2">
							<Input
								type="email"
								placeholder="Email"
								className="rounded-lg"
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>

						<div className="space-y-2">
							<Input
								type="number"
								placeholder="What is your age?"
								className="rounded-lg"
								onChange={(e) => setAge(e.target.value)}
							/>
						</div>

						<div className="space-y-2">
							<Input
								type="password"
								placeholder="Password"
								className="rounded-lg"
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>

						<div className="space-y-2">
							<Select
								onValueChange={(value) =>
									setNativeLanguage(value)
								}
							>
								<SelectLanguage placeHolderText="What is your native language?" />
							</Select>
						</div>

						<div className="space-y-2">
							<Select
								onValueChange={(value) =>
									setLanguageLearning(value)
								}
							>
								<SelectLanguage placeHolderText="What is the language you are learning?" />
							</Select>
						</div>
					</CardContent>
					<CardFooter className="flex flex-col space-y-4 pt-6">
						<Button
							className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg"
							onClick={handleSignUp}
						>
							Sign Up
						</Button>
						<div className="text-sm text-center text-gray-600">
							Already have an account?{" "}
							<Link
								href="/login"
								className="font-medium underline text-blue-700 hover:text-blue-600"
							>
								Log in
							</Link>
						</div>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
}

function SelectLanguage({ placeHolderText }: { placeHolderText: string }) {
	return (
		<div>
			<SelectTrigger className="w-full">
				<SelectValue placeholder={placeHolderText} />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectLabel>Language</SelectLabel>
					<SelectItem value="en">English</SelectItem>
					<SelectItem value="fr">French</SelectItem>
					<SelectItem value="es">Spanish</SelectItem>
					<SelectItem value="ge">German</SelectItem>
					<SelectItem value="id">Indonesian</SelectItem>
				</SelectGroup>
			</SelectContent>
		</div>
	);
}
