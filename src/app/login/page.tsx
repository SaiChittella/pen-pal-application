import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Globe } from "lucide-react";

export default function LoginPage() {
	return (
		<div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
			<div className="w-full max-w-md space-y-8">
				<div className="text-center">
					<Globe className="mx-auto h-12 w-12 text-red-600" />
					<h2 className="mt-6 text-3xl font-extrabold text-gray-900">
						Welcome back
					</h2>
					<p className="mt-2 text-sm text-gray-600">
						Sign in to continue your language journey
					</p>
				</div>
				<Card className="mt-8 shadow-lg border-t-4 border-red-600">
					<CardContent className="space-y-4 pt-6">
						<div className="space-y-2">
							<Input
								type="email"
								placeholder="Email"
								className="rounded-full"
							/>
						</div>
						<div className="space-y-2">
							<Input
								type="password"
								placeholder="Password"
								className="rounded-full"
							/>
						</div>
						<div className="flex items-center justify-between">
							<div className="flex items-center">
								<input
									id="remember-me"
									name="remember-me"
									type="checkbox"
									className="h-4 w-4 text-red-600 focus:ring-red-600 border-gray-300 rounded"
								/>
								<label
									htmlFor="remember-me"
									className="ml-2 block text-sm text-gray-900"
								>
									Remember me
								</label>
							</div>
							<div className="text-sm">
								<Link
									href="/forgot-password"
									className="font-medium text-red-700 hover:text-red-600"
								>
									Forgot your password?
								</Link>
							</div>
						</div>
					</CardContent>
					<CardFooter className="flex flex-col space-y-4 pt-6">
						<Button className="w-full bg-red-600 hover:bg-red-700 rounded-full">
							Sign In
						</Button>
						<div className="text-sm text-center text-gray-600">
							Don't have an account?{" "}
							<Link
								href="/signup"
								className="font-medium text-red-700 hover:text-red-600"
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
