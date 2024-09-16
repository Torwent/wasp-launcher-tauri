import { error } from "@sveltejs/kit"

export const load = async ({ parent, data }) => {
	const layout = await parent()
	if (!layout) error(501, "Server error getting layout data")

	return {
		session: layout.session,
		user: layout.user,
		profile: layout.profile,
		roles: layout.roles,
		url: data.url
	}
}
