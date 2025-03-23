import { getMessages } from "@/app/actions/getMessages";
import ChatPageUI from "./chatPage";
import { getCurrentUser } from "@/app/actions/getMatches";
import { getReceiver } from "@/app/actions/getReceiver";

export default async function ChatPage({ params }: { params: { id: string } }) {
	const { id } = params;

	const resultMessages = await getMessages(id);

	const currentUser = await getCurrentUser();
	const receiverUser = await getReceiver(id, currentUser?.data);

	if (
		!resultMessages.success ||
		!currentUser?.success ||
		!receiverUser?.success
	) {
		return <div>Error</div>;
	}

	if (!resultMessages.data || !currentUser?.data || !receiverUser?.data) {
		return <div>Error retreiving data</div>;
	}

	return (
		<ChatPageUI
			messages={resultMessages.data}
			currentUser={currentUser.data}
			receiverUser={receiverUser.data}
			id={id}
		/>
	);
}
