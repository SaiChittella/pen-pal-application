import { getUsers } from "@/app/actions/users";
import { getMatches, getCurrentUser } from "@/app/actions/getMatches";
import { getMessages } from "@/app/actions/getMessages";
import DashboardUI from "@/app/dashboard/dashboard";

export default async function Dashboard() {
	const resultUsers = await getUsers();

	if (!resultUsers.success || !resultUsers.data) {
		return <div>Error</div>;
	}

	const resultMatches = await getMatches(resultUsers.data);
	const currentUser = await getCurrentUser();

	let messageCount = 0;

	if (resultMatches?.data) {
		for (let i = 0; i < resultMatches.data.length; i++) {
			if (
				resultMatches.data[i].users[0].email ==
					currentUser?.data.email ||
				resultMatches.data[i].users[1].email == currentUser?.data.email
			) {
				if (resultMatches.data[i].messages) {
					const messages = await getMessages(
						resultMatches.data[i].id
					);
					if (messages.success) {
						messageCount += messages?.data?.length ?? 0;
					}
				}
			}
		}
	}


	if (!resultUsers.success || !resultMatches?.success || resultMatches?.data === undefined) {
		alert("Failed to fetch users");
	} else {
		return (
			<DashboardUI
				users={resultUsers.data}
				matches={resultMatches.data}
				messageCount={messageCount}
			/>
		);
	}
}
