import { registerAuthUrl } from "$lib/oauth2.server"

export const load = async () => {
	return { url: registerAuthUrl() }
}