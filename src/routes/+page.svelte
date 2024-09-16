<script lang="ts">
	import { supabase } from "$lib/supabase"
	import { Autocomplete, type AutocompleteOption } from "@skeletonlabs/skeleton"
	import { ChevronLeft, ChevronRight } from "lucide-svelte"
	import HoverButton from "./HoverButton.svelte"
	import JAccount from "./JAccount.svelte"
	import { dataDir } from "@tauri-apps/api/path"
	import ExecuteButton from "./ExecuteButton.svelte"
	import LinkButton from "./LinkButton.svelte"

	export let data
	const { url } = data

	async function getScripts() {
		const { data, error: err } = await supabase
			.schema("scripts")
			.from("scripts")
			.select("id, title, description, content, protected!inner(username, assets)")
			.order("title")

		if (err) {
			console.error(err)
			return []
		}

		return await Promise.all(
			data.map(async (script) => {
				return {
					id: script.id,
					title: script.title,
					description: script.description,
					content: script.content,
					username: script.protected.username,
					assets: script.protected.assets
				}
			})
		)
	}

	const scripts = getScripts()
	let script: Awaited<typeof scripts>[number] | null = null

	let selected: number = 0
	let scriptOptions: AutocompleteOption<string>[] = []

	scripts.then((awaited) => {
		for (let i = 0; i < awaited.length; i++) {
			scriptOptions = [
				...scriptOptions,
				{ label: awaited[i].title, value: awaited[i].title.toLowerCase(), meta: i }
			]
		}
	})

	$: scripts.then((awaited) => (script = awaited[selected]))

	let open: boolean = true
	let inputScript = ""

	function onScriptSelection(event: CustomEvent<AutocompleteOption<string>>) {
		selected = event.detail.meta as number
	}
</script>

{#if open}
	<button class="flex w-6" on:click={() => (open = !open)}>
		<ChevronLeft class="my-auto" />
	</button>
	<div class="flex-col w-2/6">
		<input class="input my-2 h-10" type="search" placeholder="Search..." bind:value={inputScript} />

		<Autocomplete
			name="Scripts"
			size="2"
			bind:input={inputScript}
			bind:value={selected}
			options={scriptOptions}
			class="h-[calc(100%-4rem)] select my-2 text-xs sm:text-sm overflow-y-scroll text-nowrap"
			on:selection={onScriptSelection}
		/>
	</div>
{:else}
	<button class="flex border-r-2 border-surface-500 w-6" on:click={() => (open = !open)}>
		<ChevronRight class="my-auto" />
	</button>
{/if}

<main class="container m-4 mb-0 overflow-y-scroll scrollbar-hide">
	<img
		class="object-cover rounded-md {!script ? 'animate-pulse' : ''}"
		src={script ? script.assets + "banner.jpg" : "/banner.jpg"}
		alt="Script banner"
		loading="lazy"
	/>

	<header class="text-center text-primary-500 my-8">
		<h1 class="text-3xl font-bold">
			{script ? script.title : "Loading..."}
		</h1>

		<h2 class="text-xl font-semibold">
			by {script ? script.username : "Loading..."}
		</h2>

		<h3 class="text-center text-secondary-500 my-8">
			{script ? script.description : "Loading..."}
		</h3>
	</header>

	<div class="variant-ghost-surface p-4 rounded-md h-64 overflow-auto">
		{script ? script.content : "Loading..."}
	</div>
</main>

<div class="ml-auto w-16 grid place-content-between border-l-2 border-surface-500 p-2">
	<div class="space-y-4">
		<HoverButton icon="🎮" label="Play" />
		<ExecuteButton icon="🦁" label="Open Simba 1.4" exe="simba1400" />
		<ExecuteButton icon="🦁" label="Open Simba 2.0" exe="simba2000" />
		<JAccount icon="🤖" label="Jagex Account" {url} />
	</div>

	<div class="space-y-4">
		<ExecuteButton icon="🕹️" label="Legacy" exe="legacy" />
		<ExecuteButton icon="💻" label="RuneLite" exe="runelite" />
		<ExecuteButton icon="🚀" label="OSClient" exe="osclient" />
	</div>

	<LinkButton icon="⚙️" label="Settings" href="/settings" />
</div>

<style>
	/* For Webkit-based browsers (Chrome, Safari and Opera) */
	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}

	/* For IE, Edge and Firefox */
	.scrollbar-hide {
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}
</style>
