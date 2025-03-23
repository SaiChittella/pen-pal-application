"use server";

import { database } from "@/app/firebase/config";
import { ref, set } from "firebase/database";
import { getUsers } from "./users";

interface CurrentUserData {
	email: string;
}

export async function createCurrentUser(currentUserData: CurrentUserData) {
	try {
		const usersRef = ref(database, "currentUser");

		const users = await getUsers();
		if (users) {
			const findCurrentUser = users.data?.find(
				(u) => u.email === currentUserData.email
			);
			if (findCurrentUser) {
				await set(usersRef, {
					user: findCurrentUser,
				});
			}
		}
		return { success: true };
	} catch (error) {
		alert("Error creating current user in database: " + error);
		return { success: false, error };
	}
}
