"use server";
import { database } from "@/lib/firebase/config";
import { ref, get } from "firebase/database";
import { User } from "./users";
import { getCurrentUser } from "@/lib/firebase/firebase-admin";

export interface Match extends User {
	lastMessage: string;
}

export async function getMatches(usersArr: User[]) {
	try {
		const response = await getCurrentUser();
		let currentUserData;

		if (response) {
			currentUserData = usersArr.find(
				(u) => u.email === response?.email
			);
		}

		const matchesRef = ref(database, `matches`);

		const snapshot = await get(matchesRef);

		if (snapshot.exists()) {
			const matchesArray = Object.entries(snapshot.val()).map(
				([id, data]) => ({
					id,
					...(data as object),
				})
			);

			const filteredArray = [];

			for (let i = 0; i < (matchesArray as Match[]).length; i++) {
				if (
					currentUserData?.email ==
						(matchesArray as Match[])[i].users[0].email ||
					currentUserData?.email ==
						(matchesArray as Match[])[i].users[1].email
				) {
					filteredArray.push((matchesArray as Match[])[i]);
				}
			}

			return { success: true, data: filteredArray as Match[] };
		} else {
			return { success: true, data: [] };
		}
	} catch (error) {
		console.error("Error fetching matches: ", error);
		return { success: false, error };
	}
}
