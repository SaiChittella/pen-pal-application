"use server";
import { database } from "@/app/firebase/config";
import { ref, get, push } from "firebase/database";
import { User } from "./users";

export interface Match extends User {
	lastMessage: String;
}

export async function getMatches(usersArr: User[]) {
	try {
		const response = await getCurrentUser();

		// TODO: Actually implement using a For Loop
		const currentUserData = usersArr.find(
			(u) => u.email === response?.data.email
		);

		const matchesRef = ref(database, `matches`);

		const snapshot = await get(matchesRef);

		if (snapshot.exists()) {
			const matchesArray = Object.entries(snapshot.val()).map(
				([id, data]) => ({
					id,
					...(data as Object),
				})
			);

			let filteredArray = [];

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

export async function getCurrentUser() {
	try {
		const currentUserRef = ref(database, "currentUser/user");
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
