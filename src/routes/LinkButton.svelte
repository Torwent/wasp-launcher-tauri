<script lang="ts">
	import { popup } from "@skeletonlabs/skeleton"

	export let icon: string
	export let label: string
	export let href: string
</script>

<a
	{href}
	class="btn-icon variant-filled-surface hover:text-secondary-500 [&>*]:pointer-events-none"
	use:popup={{ event: "hover", target: "popup-" + label, placement: "left" }}
>
	{icon}
</a>

<div class="card p-4 variant-filled-surface" data-popup="popup-{label}">
	<p>{label}</p>
	<div class="arrow variant-filled-surface" />
</div>
