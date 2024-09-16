<script lang="ts">
	import { invalidate } from "$app/navigation"
	import { invoke } from "@tauri-apps/api/core"
	import { open } from "@tauri-apps/plugin-dialog"

	export let data

	async function getFile(exe: string, current: string) {
		let path = await open({
			title: "Pick a " + exe.toUpperCase() + " executable",
			defaultPath: current,
			multiple: false,
			directory: false,
			filters: [{ name: "Executables", extensions: ["exe"] }]
		})
		await invoke("set_executable_path", { exe, path })
		await invalidate("executable:paths")
	}
</script>

<main class="container mx-auto">
	<div class="my-12">
		<header>
			<h1>Simba runtimes:</h1>
		</header>

		<label class="my-4">
			Simba 1.4 path:
			<input
				class="input"
				bind:value={data.simba1400}
				on:click={async () => await getFile("simba1400", data.simba1400)}
			/>
		</label>

		<label class="my-4">
			Simba 2.0 path:
			<input
				class="input"
				bind:value={data.simba2000}
				on:click={async () => await getFile("simba2000", data.simba2000)}
			/>
		</label>
	</div>

	<div class="my-12">
		<header>
			<h1>OSRS Clients:</h1>
		</header>

		<label class="my-4">
			Legacy client path:
			<input
				class="input"
				bind:value={data.legacy}
				on:click={async () => await getFile("legacy", data.legacy)}
			/>
		</label>

		<label class="my-4">
			RuneLite path:
			<input
				class="input"
				bind:value={data.runelite}
				on:click={async () => await getFile("runelite", data.runelite)}
			/>
		</label>

		<label class="my-4">
			OSClient path:
			<input
				class="input"
				bind:value={data.osclient}
				on:click={async () => await getFile("osclient", data.osclient)}
			/>
		</label>
	</div>
</main>
