<script lang="ts">
	import { page } from "$app/stores"
	import { Avatar, popup, type PopupSettings } from "@skeletonlabs/skeleton"
	import { RotateCcw } from "lucide-svelte"
	import RoleBadges from "./RoleBadges.svelte"
	import Logout from "$lib/Logout.svelte"

	let { profile } = $page.data
	$: ({ profile } = $page.data)

	const rnd =
		"https://api.dicebear.com/6.x/bottts/svg?seed=" + (Math.random() + 1).toString(36).substring(7)

	const popupSettings: PopupSettings = {
		event: "click",
		target: "userPanelPopup",
		placement: "bottom-end"
	}
</script>

<button
	name="User panel"
	use:popup={popupSettings}
	aria-label="Open user panel"
	class="flex items-center mx-4"
>
	{#await profile}
		<span class="mx-4">Loading</span>
		<Avatar
			src={rnd}
			width="w-12"
			border="border-4 border-surface-300-600-token hover:!border-primary-500 animate-pulse"
			cursor="cursor-pointer"
			class="hidden md:block"
			initials="WS"
			loading="lazy"
		/>
	{:then profile}
		<span class="mx-4">{profile.username}</span>
		<Avatar
			src={profile.avatar}
			width="w-12"
			border="border-4 border-surface-300-600-token hover:!border-primary-500"
			cursor="cursor-pointer"
			class="hidden md:block"
			initials="WS"
			loading="lazy"
		/>
	{/await}
</button>

<div class="card variant-filled-surface p-4" data-popup="userPanelPopup">
	<main class="p-4">
		<h3 class="text-center py-2">Roles</h3>
		<div class="flex py-8">
			<RoleBadges />
		</div>
	</main>
	<footer class="card-footer flex"><Logout /></footer>
</div>
