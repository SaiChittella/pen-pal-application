"use server";

import { database } from "@/app/firebase/config";
import { ref, set, update } from "firebase/database";
import { User } from "./users";
import { revalidatePath } from "next/cache";

interface MatchData {
	currentUser: User | undefined;
	targetUser: User;
}

export async function setMatches(matchData: MatchData, isReversed: boolean, revalidate: boolean) {
    const currentUser = isReversed ? matchData.targetUser : matchData.currentUser;
    const targetUser = isReversed ? matchData.currentUser : matchData.targetUser;

	try {
		const matchesRef = ref(
			database,
			`users/${currentUser?.id}/matches`
		);
		const userRef = ref(
			database,
			`users/${currentUser?.id}/matches/${targetUser?.id}`
		);

		const test = set(userRef, {
			matchedUser: targetUser,
		});

		await update(matchesRef, {
			matches: test,
		});

        if(revalidate){
            revalidatePath("/dashboard");
        }


		return { success: true };
	} catch (e) {
		console.error(e);
		return { success: false, e };
	}
}
