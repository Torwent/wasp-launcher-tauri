<script lang="ts">
	import Discord from "./components/Discord.svelte"
	import { supabase } from "./supabase"

	async function logout() {
		const { error } = await supabase.auth.signOut()
		if (error) console.error(error)
	}
</script>

<main class="mx-auto my-4 items-center">
	<form class="flex items-center" on:submit={async () => await logout()}>
		<Discord label="Logout" />
	</form>
</main>
