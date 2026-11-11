<script lang="ts">
	import Icon, { type IconifyIcon } from '@iconify/svelte';
	import { TOOLTIP_SIDE, type TooltipSide } from './tooltip.js';

	interface Props {
		/** An Iconify name, or icon data, which needs no request. */
		icon: string | IconifyIcon;
		/** Names the button, and shows as its tooltip. */
		label: string;
		/** A link when set, otherwise a button. */
		href?: string;
		onclick?: (event: MouseEvent) => void;
		tooltip?: TooltipSide;
		ref?: HTMLAnchorElement | HTMLButtonElement | null;
	}

	let { icon, label, href, onclick, tooltip = 'bottom', ref = $bindable(null) }: Props = $props();

	const CLASS =
		'flex h-8 w-8 items-center justify-center rounded-md text-base-content/60 transition-colors hover:bg-base-200 hover:text-base-content';
</script>

<div class={['tooltip', TOOLTIP_SIDE[tooltip]]} data-tip={label}>
	{#if href}
		<a bind:this={ref} {href} class={CLASS} aria-label={label} {onclick}>
			<Icon {icon} class="h-5 w-5" />
		</a>
	{:else}
		<button bind:this={ref} type="button" class={CLASS} aria-label={label} {onclick}>
			<Icon {icon} class="h-5 w-5" />
		</button>
	{/if}
</div>
