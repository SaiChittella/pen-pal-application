"use server";
import { database } from "@/app/firebase/config";
import { ref, get, query, orderByChild } from "firebase/database";

export interface Message {
	id: string;
	sender: string;
	senderEmail: string;
	content: string;
	timestamp: string;
	receiver: string;
	receiverEmail: string;
}

export async function getMessages(paramId: string) {
	try {
		const messagesRef = ref(database, `matches/${paramId}/messages`);

		// const queryRef = query(messagesRef, orderByChild("timestamp"));

		const snapshot = await get(messagesRef);

		if (snapshot.exists()) {
			const messagesArray = Object.entries(snapshot.val()).map(
				([id, data]) => ({
					id,
					...(data as Object),
				})
			);

			return { success: true, data: messagesArray as Message[] };
		} else {
			return { success: true, data: [] };
		}
	} catch (error) {
		console.error("Error fetching messages: ", error);
		return { success: false, error };
	}
}
