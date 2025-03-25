"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Globe } from "lucide-react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase/config";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);

	const [loading, setLoading] = useState(false);

	const router = useRouter();

	const handleLogin = async () => {
		try {
			if (!email.trim() || !email.includes("@")) {
				alert("Please enter a valid email address.");
				return;
			}
			if (email.length == 0 || password.length == 0) {
				alert("Please fill out all the fields!");
				return;
			}

			setLoading(true);

			const res = await signInWithEmailAndPassword(email, password);

			const idToken = await res?.user.getIdToken();

			const response = await fetch("/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ idToken }),
			});

			const resBody = await response.json();

			if (!resBody.success) {
				alert("Login failed: " + resBody.error);
				setLoading(false);
				return;
			}

			setEmail("");
			setPassword("");

			router.refresh();
			router.push("/dashboard");
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
			<div className="w-full max-w-md space-y-8">
				<div className="text-center">
					<Globe className="mx-auto h-12 w-12 text-blue-600" />
					<h2 className="mt-6 text-3xl font-extrabold text-gray-900">
						Welcome back
					</h2>
					<p className="mt-2 text-sm text-gray-600">
						Sign in to continue your language journey
					</p>
				</div>
				<Card className="mt-8 shadow-lg border-t-4 border-blue-600">
					<CardContent className="space-y-4 pt-6">
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
								type="password"
								placeholder="Password"
								className="rounded-lg"
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>
					</CardContent>
					<CardFooter className="flex flex-col space-y-4 pt-6">
						<Button
							className={`w-full rounded-lg ${
								loading
									? "bg-gray-400 cursor-not-allowed"
									: "bg-blue-600 hover:bg-blue-700"
							}`}
							onClick={handleLogin}
							disabled={loading}
						>
							{loading ? (
								<div className="flex items-center justify-center">
									<LoaderCircle />
								</div>
							) : (
								"Sign In"
							)}
						</Button>
						<div className="text-sm text-center text-gray-600">
							Do not have an account?{" "}
							<Link
								href="/signup"
								className="font-medium underline text-blue-700 hover:text-blue-600"
							>
								Sign up
							</Link>
						</div>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
}
