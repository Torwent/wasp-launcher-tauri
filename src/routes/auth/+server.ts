import { json } from "@sveltejs/kit"
import { invoke } from "@tauri-apps/api/core"
import { AuthorizationCode } from "simple-oauth2"

const client = new AuthorizationCode({
	client: {
		id: "com_jagex_auth_desktop_launcher",
		secret: "" // If needed
	},
	auth: {
		tokenHost: "https://account.jagex.com",
		authorizePath: "/oauth2/auth",
		tokenPath: "/oauth2/token"
	}
})

async function authorize(code: string, state: string) {
	// Verify the state here
	const tokenParams = {
		code,
		redirect_uri: "https://secure.runescape.com/m=weblogin/launcher-redirect"
	}

	try {
		console.log("TRYING")
		const accessToken = await client.getToken(tokenParams)
		console.log("TRIED: ", accessToken)
		return accessToken.token
	} catch (error) {
		console.error("Access Token Error", error)
		throw error
	}
}

export async function GET() {
	const code: string | null = await invoke("get_code")
	const state: string | null = await invoke("get_state")

	if (!code || !state) return json("failed")

	const result = await authorize(code, state)

	console.log(result)

	return json("here")
}
