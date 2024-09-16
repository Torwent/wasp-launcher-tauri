<script lang="ts">
	import "../app.postcss"

	// Highlight JS
	import hljs from "highlight.js/lib/core"
	import "highlight.js/styles/github-dark.css"
	import { storeHighlightJs, TabAnchor, TabGroup, LightSwitch } from "@skeletonlabs/skeleton"
	import xml from "highlight.js/lib/languages/xml" // for HTML
	import css from "highlight.js/lib/languages/css"
	import javascript from "highlight.js/lib/languages/javascript"
	import typescript from "highlight.js/lib/languages/typescript"

	hljs.registerLanguage("xml", xml) // for HTML
	hljs.registerLanguage("css", css)
	hljs.registerLanguage("javascript", javascript)
	hljs.registerLanguage("typescript", typescript)
	storeHighlightJs.set(hljs)

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from "@floating-ui/dom"
	import { storePopup } from "@skeletonlabs/skeleton"
	import { onMount } from "svelte"
	import { goto, invalidate } from "$app/navigation"
	import { supabase } from "$lib/supabase"
	import { BadgeEuro, FileQuestion, ScrollText } from "lucide-svelte"
	import { page } from "$app/stores"
	import Login from "$lib/Login.svelte"
	import Logo from "$lib/components/Logo.svelte"
	import UserPanel from "./UserPanel.svelte"
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow })

	export let data
	$: ({ session } = data)

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (!newSession) {
				setTimeout(() => goto("/", { invalidateAll: true }))
			}

			if (newSession?.expires_at !== session?.expires_at) {
				invalidate("supabase:auth")
			}
		})

		return () => data.subscription.unsubscribe()
	})
</script>

{#if !session}
	<main class="container h-screen mx-auto flex justify-center items-center">
		<Login />
	</main>
{:else}
	<main class="flex-col h-screen max-h-screen overflow-hidden">
		<TabGroup
			justify="justify-between"
			active="text-primary-600-300-token"
			hover="hover:text-secondary-700-200-token"
			flex="flex-1 lg:flex-none"
			class="bg-surface-100-800-token w-full"
		>
			<Logo />

			<nav class="flex items-center">
				<TabAnchor href="/" selected={$page.url.pathname === "/"}>
					<div class="flex items-center">
						<ScrollText />
						<span class="mx-2">Scripts</span>
					</div>
				</TabAnchor>
				<TabAnchor href="/subscriptions" selected={$page.url.pathname === "/subscriptions"}>
					<div class="flex items-center">
						<BadgeEuro />
						<span class="mx-2">Subscription</span>
					</div>
				</TabAnchor>

				<TabAnchor href="/faq" selected={$page.url.pathname === "/faq"}>
					<div class="flex items-center">
						<FileQuestion />
						<span class="mx-2">FAQ</span>
					</div>
				</TabAnchor>
			</nav>

			<div class="flex items-center mx-4">
				<UserPanel />
				<LightSwitch />
			</div>
		</TabGroup>

		<main class="bg-surface flex h-full max-h-[90%] w-full justify-items-end grow">
			<slot />
		</main>
	</main>
{/if}
