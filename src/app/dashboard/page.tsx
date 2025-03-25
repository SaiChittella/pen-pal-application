import { getUsers } from "@/app/_actions/users";
import { getMatches } from "@/app/_actions/getMatches";
import { getMessages } from "@/app/_actions/getMessages";
import DashboardUI from "@/app/dashboard/dashboard";
import { getCurrentUser } from "@/lib/firebase/firebase-admin";
import { redirect } from "next/navigation";

export default async function Dashboard() {
	const resultUsers = await getUsers();

	if (!resultUsers.success || !resultUsers.data) {
		return <div>Error</div>;
	}

	const currentUserAuth = await getCurrentUser();
	if (!currentUserAuth) {
		redirect("/login");
	}

	const currentUserData = resultUsers.data.find(
		(u) => u.email === currentUserAuth.email
	);

	if (!currentUserData) {
		redirect("/login");
	}

	const resultMatches = await getMatches(resultUsers.data);

	let messageCount = 0;

	if (resultMatches?.data && currentUserData) {
		for (let i = 0; i < resultMatches.data.length; i++) {
			if (
				resultMatches.data[i].users[0].email == currentUserData.email ||
				resultMatches.data[i].users[1].email == currentUserData.email
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

	if (
		!resultUsers.success ||
		!resultMatches?.success ||
		resultMatches?.data === undefined
	) {
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
