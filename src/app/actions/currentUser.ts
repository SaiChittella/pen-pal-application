"use server";

import { database } from "@/app/firebase/config";
import { ref, set, push } from "firebase/database";

interface CurrentUserData {
	email: string;
}

export async function createCurrentUser(currentUserData: CurrentUserData) {
	try {
		const usersRef = ref(database, "currentUser");

		await set(usersRef, {
			email: currentUserData.email,
		});

		return { success: true };
	} catch (error) {
		console.error("Error creating current user in database:", error);
		return { success: false, error };
	}
}
