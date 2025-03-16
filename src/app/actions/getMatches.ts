"use server";

import { database } from "@/app/firebase/config";
import { ref, get } from "firebase/database";
import { User } from "./users";

export interface Match extends User {
	lastMessage: String;
}

export async function getMatches(usersArr: User[]) {
	try {
		const response = await getCurrentUser();

		const currentUserData = usersArr.find(
			(u) => u.email === response?.data.email
		);

		const usersRef = ref(database, `users/${currentUserData?.id}/matches`);

		const snapshot = await get(usersRef);

		if (snapshot.exists()) {
			const matchesArray = Object.entries(snapshot.val()).map(
				([id, data]) => ({
					id,
					...(data as Object),
				})
			);

			return { success: true, data: matchesArray as Match[] };
		} else {
			return { success: true, data: [] };
		}
	} catch (error) {
		console.error("Error fetching matches: ", error);
		return { success: false, error };
	}
}

export async function getCurrentUser() {
	try {
		const currentUserRef = ref(database, "currentUser");
		const snapshot = await get(currentUserRef);

		if (snapshot.exists()) {
			const data = snapshot.val();

			return {
				success: true,
				data: { id: snapshot.key, ...data } as User,
			};
		}
	} catch (error) {
		console.error("Could not get the current User: " + error);
	}
}
