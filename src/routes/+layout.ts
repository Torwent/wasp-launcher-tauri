import { getProfile, getRoles, getSession, getUser } from "$lib/supabase"

export const prerender = true
export const ssr = false

export const load = async ({ depends }) => {
	depends("supabase:auth")

	return {
		session: await getSession(),
		user: getUser(),
		profile: getProfile(getUser()),
		roles: getRoles(getUser())
	}
}
