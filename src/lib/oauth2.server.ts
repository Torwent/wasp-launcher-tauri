import { AuthorizationCode } from "simple-oauth2"

interface TokenSet {
	accessToken: string
	refreshToken: string
	idToken: string
	expiresAt: number
	loginProvider: "Jagex" | "Runescape"
}

interface RSProfileResponse {
	display_name_set: boolean
	display_name: string | null
}

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

class RSProfile implements RSProfileResponse {
	constructor(
		public display_name_set: boolean,
		public display_name: string | null
	) {}

	getDisplayName(): string | null {
		return this.display_name
	}
}

interface SessionID {
	0: string
}

interface GameSessionID {
	sessionId: SessionID
}

interface AccountID {
	0: string
}

interface DisplayName {
	0: string
}

interface GameSessionAccount {
	accountId: AccountID
	displayName: DisplayName
}

class GameSession {
	constructor(
		public sessionId: GameSessionID,
		public accounts: GameSessionAccount[]
	) {}

	static new(sessionId: GameSessionID, accounts: GameSessionAccount[]): GameSession {
		return new GameSession(sessionId, accounts)
	}
}

const redirectURI = "https://secure.runescape.com/m=weblogin/launcher-redirect"

function generateRandomState(length: number = 32): string {
	const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
	let result = ""
	const randomValues = new Uint8Array(length)
	crypto.getRandomValues(randomValues)

	for (let i = 0; i < length; i++) {
		result += charset[randomValues[i] % charset.length]
	}

	return result
}

export function registerAuthUrl(): string {
	const authorizationUri = client.authorizeURL({
		redirect_uri: redirectURI,
		scope: ["openid", "offline", "gamesso.token.create", "user.profile.read"],
		state: generateRandomState()
	})

	return authorizationUri
}

export async function authorize(code: string, state: string) {
	// Verify the state here
	const tokenParams = { code, redirect_uri: redirectURI }

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

async function refreshTokens(refreshToken: string): Promise<TokenSet> {
	try {
		const accessToken = await client
			.createToken({
				refresh_token: refreshToken
			})
			.refresh()
		return accessToken.token
	} catch (error) {
		console.error("Error refreshing access token", error)
		throw error
	}
}

class LauncherClient {
	private tokens: TokenSet | null = null

	async refreshedTokens(): Promise<TokenSet> {
		if (!this.tokens) {
			throw new Error("Not initialized")
		}

		if (this.isTokenExpired()) {
			this.tokens = await refreshTokens(this.tokens.refreshToken)
		}

		return this.tokens
	}

	private isTokenExpired(): boolean {
		if (!this.tokens || !this.tokens.expiresAt) {
			return true
		}
		return new Date() > new Date(this.tokens.expiresAt * 1000)
	}

	// Add other methods as needed
}

async function fetchGameProfile(idToken: string): Promise<RSProfileResponse> {
	const response = await fetch("https://secure.jagex.com/rs-profile/v1/profile", {
		headers: {
			Authorization: `Bearer ${idToken}`
		}
	})
	return await response.json()
}

async function fetchGameSession(idToken: string): Promise<GameSession> {
	const sessionResponse = await fetch("https://auth.jagex.com/game-session/v1/sessions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ idToken })
	})
	const sessionId = await sessionResponse.json()

	const accountsResponse = await fetch("https://auth.jagex.com/game-session/v1/accounts", {
		headers: {
			Authorization: `Bearer ${sessionId.sessionId}`
		}
	})
	const accounts = await accountsResponse.json()

	return { sessionId, accounts }
}
