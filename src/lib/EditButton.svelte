<script lang="ts">
	import Icon from '@iconify/svelte';
	import * as icons from './icons.js';
	import { labels } from './labels.svelte.js';
	import { TOOLTIP_SIDE, type TooltipSide } from './tooltip.js';

	interface Props {
		/** Editor link; without one the button is read-only and says why. */
		href: string | null;
		tooltip?: TooltipSide;
	}

	let { href, tooltip = 'bottom' }: Props = $props();

	const reasonId = $props.id();
</script>

{#if href}
	<a {href} class="btn gap-1.5 btn-ghost btn-sm">
		<Icon icon={icons.pencil} class="h-4 w-4" />
		{labels.edit}
	</a>
{:else}
	<!-- `aria-disabled` rather than `disabled`, so keyboard users can reach the button and its reason. -->
	<div class={['tooltip', TOOLTIP_SIDE[tooltip]]} data-tip={labels.editReadOnly}>
		<button
			type="button"
			class="btn gap-1.5 btn-ghost btn-sm"
			aria-disabled="true"
			aria-describedby={reasonId}
		>
			<Icon icon={icons.pencil} class="h-4 w-4" />
			{labels.edit}
		</button>
		<span id={reasonId} class="sr-only">{labels.editReadOnly}</span>
	</div>
{/if}
