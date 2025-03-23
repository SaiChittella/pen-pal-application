"use server";
import { database } from "@/app/firebase/config";
import { ref, get } from "firebase/database";
import { User } from "./users";

export async function getReceiver(
	paramId: string,
	currentUser: User | undefined
) {
	try {
		const matchesRef = ref(database, `matches/${paramId}/users`);
		const snapshot = await get(matchesRef);

		if (snapshot.exists()) {
			const usersArray = Object.entries(snapshot.val()).map(
				([id, data]) => ({
					id,
					...(data as object),
				})
			);

			const receiver = (usersArray as User[]).find(
				(u) => u.email !== currentUser?.email
			);

			return { success: true, data: receiver as User };
		} else {
			return { success: true };
		}
	} catch (error) {
		console.error("Error fetching messages: ", error);
		return { success: false, error };
	}
}
