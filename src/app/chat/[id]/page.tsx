import { getMessages } from "@/app/_actions/getMessages";
import ChatPageUI from "./chatPage";
import { getReceiver } from "@/app/_actions/getReceiver";
import { getCurrentUser } from "@/lib/firebase/firebase-admin";
import { getUsers } from "@/app/_actions/users";
import { User } from "@/app/_actions/users";

interface ChatPageProps {
	params: Promise<{
		id: string;
	}>;
}

export default async function ChatPage({ params }: ChatPageProps) {
	const { id } = await params;

	const resultMessages = await getMessages(id);

	const currentUserAuth = await getCurrentUser();
	const receiverUser = await getReceiver(id, currentUserAuth?.email);

	if (!resultMessages.success || !currentUserAuth || !receiverUser?.success) {
		return <div>Error</div>;
	}

	if (!resultMessages.data || !currentUserAuth || !receiverUser?.data) {
		return <div>Error retrieving data</div>;
	}

	const users = await getUsers();
	let currentUserData;

	if (users) {
		currentUserData = users.data?.find((u) => u.email === currentUserAuth?.email);
	}

	return (
		<ChatPageUI
			initialMessages={resultMessages.data}
			currentUser={currentUserData as User}
			receiverUser={receiverUser.data}
			id={id}
		/>
	);
}
