"use server";

import { database } from "@/app/firebase/config";
import { ref, set, push, update } from "firebase/database";
import { User } from "./users";

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
		const date = new Date();

		await set(newDataRef, {
			email: userData.email,
			name: userData.name,
			age: userData.age,
			nativeLanguage: userData.nativeLanguage,
			languageLearning: userData.languageLearning,
			memberSince: date.toLocaleDateString("en-US", {
				year: "numeric",
				month: "long",
				day: "numeric",
			}),
		});

		return { success: true };
	} catch (error) {
		console.error("Error creating user in database:", error);
		return { success: false, error };
	}
}

export async function updateUserInDatabase(
	currentUserData: User,
	updateEmail: string,
	updateName: string
) {
	try {
		const usersRef = ref(database, `users/${currentUserData?.id}`);

		await update(usersRef, {
			email: updateEmail,
			name: updateName,
		});

		return { success: true };
	} catch (error) {
		console.error("Error creating user in database:", error);
		return { success: false, error };
	}
}
