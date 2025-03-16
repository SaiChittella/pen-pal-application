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
			// TODO: Figure out how to get response from the user + set the current user with it to remove the clunky search in database for the current user.
			const res = await createUserWithEmailAndPassword(email, password);
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
				console.error("Failed to create user in database");
			}
		} catch (e) {
			console.error(e);
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
				L
				{/* TODO: Have a form instead of 10 Input Statements that retreives an object of the values the user passes in */}
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
							<Input
								type="password"
								placeholder="Re-ype your password"
								className="rounded-lg"
							/>
						</div>

						<div className="space-y-2">
							<Input
								type="text"
								placeholder="What is your native/proficient language?"
								className="rounded-lg"
								onChange={(e) =>
									setNativeLanguage(e.target.value)
								}
							/>
						</div>

						<div className="space-y-2">
							<Input
								type="text"
								placeholder="What language are you trying to learn?"
								className="rounded-lg"
								onChange={(e) =>
									setLanguageLearning(e.target.value)
								}
							/>
						</div>
					</CardContent>
					<CardFooter className="flex flex-col space-y-4 pt-6">
						<Button
							className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg"
							onClick={handleSignUp}
						>
							Sign Up
						</Button>
						<Button className="w-full bg-white hover:bg-gray-100 text-black rounded-lg">
							<img
								src="/google.svg"
								className="w-6 h-6 mr-2"
							></img>
							Sign up with Google
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
