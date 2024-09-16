<script lang="ts">
	import { goto } from "$app/navigation"
	import { popup } from "@skeletonlabs/skeleton"
	import { invoke } from "@tauri-apps/api/core"

	export let icon: string
	export let label: string
	export let url: string

	let code: string | null = null
	let state: string | null = null

	async function jLogin() {
		//await invoke("jagex_login", { url })
		goto("/auth")
	}

	async function getResult() {
		code = await invoke("get_code")
		state = await invoke("get_state")
	}
</script>

<button
	class="btn-icon variant-filled-surface hover:text-secondary-500 [&>*]:pointer-events-none"
	use:popup={{ event: "hover", target: "popup-" + label, placement: "left" }}
	on:click={jLogin}
>
	{icon}
</button>

<div class="card p-4 variant-filled-surface" data-popup="popup-{label}">
	<p>{label}</p>
	<div class="arrow variant-filled-surface" />
</div>
