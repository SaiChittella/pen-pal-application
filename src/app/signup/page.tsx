import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Globe } from "lucide-react";
import Image from "next/image";

export default function SignupPage() {
	return (
		<div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
			<div className="w-full max-w-md space-y-8">
				<div className="text-center">
					<Globe className="mx-auto h-12 w-12 text-blue-600" />
					<h2 className="mt-6 text-3xl font-extrabold text-gray-900 baloo-2">
						Create your account!
					</h2>
					<p className="mt-2 text-sm text-gray-600 baloo-2">
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
							/>
						</div>

						<div className="space-y-2">
							<Input
								type="email"
								placeholder="Email"
								className="rounded-lg"
							/>
						</div>

						<div className="space-y-2">
							<Input
								type="number"
								placeholder="What is your age?"
								className="rounded-lg"
							/>
						</div>

						<div className="space-y-2">
							<Input
								type="password"
								placeholder="Password"
								className="rounded-lg"
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
							/>
						</div>

						<div className="space-y-2">
							<Input
								type="text"
								placeholder="What language are you trying to learn?"
								className="rounded-lg"
							/>
						</div>
					</CardContent>
					<CardFooter className="flex flex-col space-y-4 pt-6">
						<Button className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg">
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
