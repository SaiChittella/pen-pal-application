import { getUsers } from "@/app/actions/users";
import { getMatches } from "@/app/actions/getMatches";
import DashboardUI from "@/app/dashboard/dashboard";

export default async function Dashboard() {
	const resultUsers = await getUsers();

	if (!resultUsers.success || !resultUsers.data) {
		return <div>Error</div>;
	}

	const resultMatches = await getMatches(resultUsers.data);

	if (!resultUsers.success && !resultMatches?.success) {
		console.error("Failed to fetch users");
	} else {
		return (
			<DashboardUI
				users={resultUsers.data}
				matches={resultMatches?.data}
			/>
		);
	}
}
