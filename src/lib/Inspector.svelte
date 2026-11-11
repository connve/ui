<script lang="ts">
	import { onMount, untrack, type Snippet } from 'svelte';
	import { cubicOut } from 'svelte/easing';
	import { prefersReducedMotion } from 'svelte/motion';
	import { MediaQuery } from 'svelte/reactivity';
	import { slide } from 'svelte/transition';
	import IconButton from './IconButton.svelte';
	import * as icons from './icons.js';
	import PaneResizer from './PaneResizer.svelte';
	import { keepFocusWithin } from './focus.js';
	import { labels } from './labels.svelte.js';
	import { MOBILE_QUERY } from './mobile.js';
	import { inspectorWidth as pane } from './paneSize.svelte.js';
	import { getShell } from './shell.svelte.js';

	interface Props {
		/** Names the inspected item, e.g. a tool or a log's task. */
		title: string;
		/** Names the panel for assistive tech. */
		label: string;
		onclose: () => void;
		/** Steps back to the list this item was opened from. */
		onback?: () => void;
		/** Names that list on the back button. */
		backLabel?: string;
		/** A line under the title, e.g. the item's status or path. */
		subtitle?: Snippet;
		/** Buttons before the close button. */
		actions?: Snippet;
		children: Snippet;
	}

	let { title, label, onclose, onback, backLabel, subtitle, actions, children }: Props = $props();

	const shell = getShell('Inspector');

	let width = $derived(`min(${pane.size}px, 50vw)`);

	/** On a phone the inspector covers the page, so it acts as a dialog; it follows the window as it resizes or turns. */
	const phone = new MediaQuery(MOBILE_QUERY);
	let covers = $derived(phone.current);
	let panel = $state<HTMLElement | null>(null);

	onMount(() => {
		shell.inspectors += 1;
		return () => (shell.inspectors -= 1);
	});

	// Covering the page, it takes focus as it opens: the panel rather than a button, so the Enter
	// that opened it can't also press that button. Closing gives focus back to where it came from,
	// unless it has moved on outside the panel.
	$effect(() => {
		if (!panel) return;
		const el = panel;
		const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		if (untrack(() => covers)) el.focus();
		return () => {
			const active = document.activeElement;
			if (!active || active === document.body || el.contains(active)) opener?.focus();
		};
	});

	function onkeydown(event: KeyboardEvent) {
		if (!covers || !panel) return;
		if (event.key === 'Escape' && !event.defaultPrevented) onclose();
		else keepFocusWithin(event, panel);
	}
</script>

<aside
	bind:this={panel}
	tabindex="-1"
	class="relative flex shrink-0 flex-col border-l border-base-200 bg-base-100 outline-none max-md:fixed max-md:inset-y-0 max-md:right-0 max-md:z-40 max-md:w-full! max-md:shadow-xl"
	style:width
	role={covers ? 'dialog' : undefined}
	aria-modal={covers ? 'true' : undefined}
	aria-label={label}
	{onkeydown}
	transition:slide={{
		axis: 'x',
		duration: prefersReducedMotion.current ? 0 : 200,
		easing: cubicOut
	}}
>
	{#if !covers}
		<PaneResizer {pane} />
	{/if}
	<div class="flex min-h-0 flex-1 flex-col max-md:w-full!" style:width>
		<div class={['flex h-16 shrink-0 items-center gap-1 pr-3', onback ? 'pl-3' : 'pl-6']}>
			{#if onback}
				<IconButton
					icon={icons.chevronLeft}
					label={backLabel ?? labels.back}
					tooltip="right"
					onclick={onback}
				/>
			{/if}
			<div class="min-w-0 flex-1">
				<h2 class="truncate text-[0.9375rem] font-semibold">{title}</h2>
				{#if subtitle}
					<div
						class="mt-0.5 flex min-w-0 items-center gap-1.5 truncate text-xs text-base-content/60"
					>
						{@render subtitle()}
					</div>
				{/if}
			</div>
			{@render actions?.()}
			<IconButton icon={icons.x} label={labels.close} tooltip="left" onclick={onclose} />
		</div>
		<div class="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 pb-6 text-sm">
			{@render children()}
		</div>
	</div>
</aside>
