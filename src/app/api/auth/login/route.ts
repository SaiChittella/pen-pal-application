	import { cookies } from "next/headers";
	import { NextRequest, NextResponse } from "next/server";

	import { createSessionCookie } from "@/lib/firebase/firebase-admin";

	export async function POST(request: NextRequest) {
		try {
			const reqBody = await request.json();

			if (!reqBody?.idToken) {
				return NextResponse.json(
					{ success: false, error: "Missing ID token" },
					{ status: 400 }
				);
			}

			const idToken = reqBody.idToken;
			const expiresIn = 60 * 60 * 24 * 5 * 1000;

			const sessionCookie = await createSessionCookie(idToken, { expiresIn });

			(await cookies()).set("__session", sessionCookie, {
				maxAge: expiresIn,
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
			});

			return NextResponse.json({
				success: true,
				data: "Signed in successfully.",
			});
		} catch (error) {
			console.error("Error in /api/auth/login:", error);

			return NextResponse.json(
				{ success: false, error: "Internal Server Error" },
				{ status: 500 }
			);
		}
	}
