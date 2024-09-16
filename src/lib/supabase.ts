import { createClient, type User } from "@supabase/supabase-js"
import type { Database } from "./types/supabase"
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from "$env/static/public"

export const supabase = createClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
	auth: {
		autoRefreshToken: true,
		detectSessionInUrl: true,
		persistSession: true
	}
})

export async function getSession() {
	const {
		data: { session }
	} = await supabase.auth.getSession()

	return session
}

export async function getUser() {
	const {
		data: { user }
	} = await supabase.auth.getUser()

	return user
}

export async function getProfile(userPromise: Promise<User | null>) {
	const user = await userPromise
	if (!user) return null
	const { data, error: err } = await supabase
		.schema("profiles")
		.from("profiles")
		.select(`id, discord, username, avatar, customer_id`)
		.eq("id", user.id)
		.single()

	if (err) return null

	return data
}

export async function getRoles(userPromise: Promise<User | null>) {
	const user = await userPromise
	if (!user) return null
	const { data, error: err } = await supabase
		.schema("profiles")
		.from("roles")
		.select("banned, premium, vip, tester, scripter, moderator, administrator")
		.eq("id", user.id)
		.single()

	if (err) return null

	return data
}
