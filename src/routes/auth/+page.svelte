<script lang="ts">
	//import { authorize } from '$lib/oauth2.js'
	import { invoke } from "@tauri-apps/api/core"

	export let data
	const { url } = data

	console.log(url)

	let code: string | null = null
	let state: string | null = null

	async function greet() {
		await invoke("jagex_login", { url: url })
	}

	async function getResult() {
		//code = "REDACTED SO YOU CAN'T HACK ME! BUT I HAVE THE AUTH CODE"
		//state = "REDACTED SO YOU CAN'T HACK ME! BUT I HAVE THE AUTH STATE"
		code = await invoke("get_code")
		state = await invoke("get_state")
	}

	async function testToken() {
		const result = await fetch("/auth", { method: "GET" })
	}
</script>

<div class="my-4 mx-auto">
	<h3 class="text-xl my-14">Dev Page... this will not exist when this is finished.</h3>
	<button class="btn variant-outline-secondary" on:click={greet}> Jagex Login </button>

	<button class="btn variant-outline-secondary" on:click={getResult}> Update Result </button>

	<button class="btn variant-outline-secondary" on:click={testToken}> Test Token </button>

	<div class="my-4">
		<p class="flex py-4">Code: {code}</p>
		<p class="flex py-4">State: {state}</p>
	</div>
</div>
