<script lang="ts">
	import Discord from './components/Discord.svelte';
	import Logo from './components/Logo.svelte';
	import { supabase } from './supabase';

	async function login() {
		console.log('Logging in with discord...');
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: 'discord',
			options: {}
		});

		if (error) console.error(error);
		console.log(data);
	}
</script>

<main class="mx-auto my-24 items-center">
	<Logo />
	<form class="flex my-20 items-center" on:submit={async () => await login()}>
		<Discord label="Login with Discord" />
	</form>
</main>
