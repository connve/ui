<script lang="ts">
	import Icon from '@iconify/svelte';
	import * as icons from './icons.js';
	import { onDestroy } from 'svelte';
	import { labels } from './labels.svelte.js';
	import { TOOLTIP_SIDE, type TooltipSide } from './tooltip.js';

	interface Props {
		text: string | null | undefined;
		/** Names the button, and shows as its tooltip; `labels.copy` when unset. */
		label?: string;
		size?: 'xs' | 'sm';
		tooltip?: TooltipSide;
	}

	let { text, label, size = 'sm', tooltip = 'left' }: Props = $props();

	let copied = $state(false);
	let timeout: ReturnType<typeof setTimeout> | undefined;

	onDestroy(() => clearTimeout(timeout));

	async function onclick() {
		if (!text) return;
		try {
			await navigator.clipboard.writeText(text);
			copied = true;
			clearTimeout(timeout);
			timeout = setTimeout(() => (copied = false), 1500);
		} catch {
			// Clipboard refused — silent no-op.
		}
	}
</script>

<div
	class={['tooltip', TOOLTIP_SIDE[tooltip]]}
	data-tip={copied ? labels.copied : (label ?? labels.copy)}
>
	<button
		type="button"
		class={[
			'flex items-center justify-center rounded-md text-base-content/60 transition-colors hover:bg-base-200 hover:text-base-content disabled:opacity-40',
			size === 'xs' ? 'h-6 w-6' : 'h-8 w-8'
		]}
		aria-label={label ?? labels.copy}
		{onclick}
		disabled={!text}
	>
		<Icon
			icon={copied ? icons.check : icons.copy}
			class="{size === 'xs' ? 'h-4 w-4' : 'h-5 w-5'} {copied ? 'text-primary' : ''}"
		/>
	</button>
	<!-- Always present, so screen readers announce the confirmation when it appears. -->
	<span class="sr-only" role="status">{copied ? labels.copied : ''}</span>
</div>
