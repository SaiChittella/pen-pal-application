"use server";

import { database } from "@/app/firebase/config";
import { ref, set, push } from "firebase/database";

export interface UserData {
	email: string;
	name: string;
	age: string;
	nativeLanguage: string;
	languageLearning: string;
}

export async function createUserInDatabase(userData: UserData) {
	try {
		const usersRef = ref(database, "users");
		const newDataRef = push(usersRef);

		await set(newDataRef, {
			email: userData.email,
			name: userData.name,
			age: userData.age,
			nativeLanguage: userData.nativeLanguage,
			languageLearning: userData.languageLearning,
		});

		return { success: true };
	} catch (error) {
		console.error("Error creating user in database:", error);
		return { success: false, error };
	}
}
