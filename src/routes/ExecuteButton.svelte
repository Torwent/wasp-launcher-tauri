<script lang="ts">
	import { popup } from "@skeletonlabs/skeleton"
	import { invoke } from "@tauri-apps/api/core"

	export let icon: string
	export let label: string
	export let exe: string
	export let args: string[] = []

	async function execute() {
		const res = await invoke("run_executable", { exe, args })
		console.log(res)
	}
</script>

<button
	class="btn-icon variant-filled-surface hover:text-secondary-500 [&>*]:pointer-events-none"
	use:popup={{ event: "hover", target: "popup-" + label, placement: "left" }}
	on:click={execute}
>
	{icon}
</button>

<div class="card p-4 variant-filled-surface" data-popup="popup-{label}">
	<p>{label}</p>
	<div class="arrow variant-filled-surface" />
</div>
