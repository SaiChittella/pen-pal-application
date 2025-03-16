"use server";

import { database } from "@/app/firebase/config";
import { ref, get } from "firebase/database";

export interface User {
	id: string;
	name: string;
	languageLearning: string;
	nativeLanguage: string;
	age: number;
	email: string;
	[key: string]: any;
}

export async function getUsers() {
	try {
		const usersRef = ref(database, "users");
		const snapshot = await get(usersRef);

		if (snapshot.exists()) {
			const usersArray = Object.entries(snapshot.val()).map(
				([id, data]) => ({
					id,
					...(data as Object),
				})
			);
			return { success: true, data: usersArray as User[] };
		} else {
			return { success: true, data: [] };
		}
	} catch (error) {
		console.error("Error fetching users:", error);
		return { success: false, error };
	}
}
