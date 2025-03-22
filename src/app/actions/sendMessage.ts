"use server";
import { database } from "@/app/firebase/config";
import { ref, update, push, serverTimestamp } from "firebase/database";
import { revalidatePath } from "next/cache";

export async function sendMessage(
	content: string,
	sender: string | undefined,
	senderEmail: string | undefined,
	receiver: string | undefined,
	receiverEmail: string | undefined,
	id: string
) {
	try {
		const messagesRef = ref(database, `matches/${id}/messages`);

		await push(messagesRef, {
			content: content,
			sender: sender,
			senderEmail: senderEmail,
			receiver: receiver,
			receiverEmail: receiverEmail,
			timestamp: serverTimestamp(),
		});

		revalidatePath(`/chat/${id}`);

		return { success: true };
	} catch (e) {
		console.error(e);
		return { success: false, e };
	}
}
