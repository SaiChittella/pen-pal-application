"use server";
import { database } from "@/lib/firebase/config";
import { ref, push, serverTimestamp } from "firebase/database";
import { revalidatePath } from "next/cache";
import axios from "axios";

export async function sendMessage(
	content: string,
	sender: string,
	senderEmail: string,
	receiver: string,
	receiverEmail: string,
	receiverUserLanguageLearning: string,
	id: string
) {
	try {
		const messagesRef = ref(database, `matches/${id}/messages`);

		const response = await axios.post(
			`https://api-free.deepl.com/v2/translate`,
			null,
			{
				params: {
					auth_key: process.env.NEXT_PUBLIC_DEEPL_API_KEY,
					text: content,
					target_lang: receiverUserLanguageLearning,
				},
			}
		);

		await push(messagesRef, {
			senderTranslation: content,
			sender: sender,
			senderEmail: senderEmail,
			receiver: receiver,
			receiverEmail: receiverEmail,
			receiverTranslation: response.data.translations[0].text,
			timestamp: serverTimestamp(),
		});

		revalidatePath(`/chat/${id}`);

		return { success: true };
	} catch (e) {
		console.error(e);
		return { success: false, e };
	}
}
