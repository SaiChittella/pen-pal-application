"use server";

import { database } from "@/app/firebase/config";
import { ref, set, push } from "firebase/database";
import { User } from "./users";
import { revalidatePath } from "next/cache";

interface MatchData {
	currentUser: User;
	targetUser: User;
}

export async function setMatches(matchData: MatchData, revalidate: boolean) {
	try {
		const matchesRef = ref(database, "matches");
		const newDataRef = push(matchesRef);

		await set(newDataRef, {
			users: [matchData.currentUser, matchData.targetUser],
		});

		if (revalidate) {
			revalidatePath("/dashboard");
		}

		return { success: true };
	} catch (e) {
		console.error(e);
		return { success: false, e };
	}
}
