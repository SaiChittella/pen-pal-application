import "server-only";

import { cookies } from "next/headers";

import {
	initializeApp,
	getApps,
	cert,
	ServiceAccount,
} from "firebase-admin/app";
import { SessionCookieOptions, getAuth } from "firebase-admin/auth";

import admin from "firebase-admin";

import serviceAccount from "./Pen Pal Application Firebase Service Account.json";

export const firebaseApp =
	getApps().find((it) => it.name === "firebase-admin-app") ||
	initializeApp(
		{
			credential: admin.credential.cert(serviceAccount as ServiceAccount),
			databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
		},
		"firebase-admin-app"
	);
export const auth = getAuth(firebaseApp);

export async function isUserAuthenticated(
	session: string | undefined = undefined
) {
	const _session = session ?? (await getSession());
	if (!_session) return false;

	try {
		const isRevoked = !(await auth.verifySessionCookie(_session, true));
		return !isRevoked;
	} catch (error) {
		console.log(error);
		return false;
	}
}

export async function getCurrentUser() {
	const session = await getSession();

	if (!(await isUserAuthenticated(session))) {
		return null;
	}

	const decodedIdToken = await auth.verifySessionCookie(session!);
	const currentUser = await auth.getUser(decodedIdToken.uid);

	return currentUser;
}

async function getSession() {
	try {
		return (await cookies()).get("__session")?.value;
	} catch (error) {
		return undefined;
	}
}

export async function createSessionCookie(
	idToken: string,
	sessionCookieOptions: SessionCookieOptions
) {
	return auth.createSessionCookie(idToken, sessionCookieOptions);
}

export async function revokeAllSessions(session: string) {
	const decodedIdToken = await auth.verifySessionCookie(session);

	return await auth.revokeRefreshTokens(decodedIdToken.sub);
}
