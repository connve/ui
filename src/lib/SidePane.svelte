<script lang="ts">
	import Icon from '@iconify/svelte';
	import * as icons from './icons.js';
	import { getAllContexts, tick, type Snippet } from 'svelte';
	import { MediaQuery } from 'svelte/reactivity';
	import ContextBridge from './ContextBridge.svelte';
	import PaneResizer from './PaneResizer.svelte';
	import { keepFocusWithin } from './focus.js';
	import { MOBILE_QUERY, PANE_OVER_PAGE } from './mobile.js';
	import { sidePaneWidth as pane } from './paneSize.svelte.js';
	import { getShell } from './shell.svelte.js';

	interface Props {
		open: boolean;
		/** Names the pane above its content, e.g. "Folders". */
		title: string;
		collapseLabel: string;
		expandLabel: string;
		ontoggle: () => void;
		/** Closes the pane from the backdrop or Escape on a phone. */
		onclose: () => void;
		children: Snippet;
		/** Actions kept on the narrow rail while the pane is collapsed. */
		rail?: Snippet;
	}

	let { open, title, collapseLabel, expandLabel, ontoggle, onclose, children, rail }: Props =
		$props();

	const shell = getShell('SidePane');
	// The shell renders the pane, so its content gets this page's contexts passed along.
	const contexts = getAllContexts();
	const titleId = $props.id();

	/** Below this window width an open inspector folds the pane. */
	const roomy = new MediaQuery('min-width: 1280px', true);
	const phone = new MediaQuery(MOBILE_QUERY);

	const anyInspector = $derived(shell.inspectors > 0);
	// Unfolded by hand while an inspector is open; folds again when the first opens or the last closes.
	let unfolded = $derived.by(() => {
		void anyInspector;
		return false;
	});
	let folded = $derived(open && !unfolded && anyInspector && !roomy.current);
	let shown = $derived(open && !folded);
	/** On a phone the open pane covers the page, so it acts as a dialog. */
	let covers = $derived(shown && phone.current);
	let panel = $state<HTMLElement | null>(null);

	function toggle() {
		if (folded) unfolded = true;
		else ontoggle();
	}

	$effect(() => {
		shell.pane = aside;
		return () => {
			if (shell.pane === aside) shell.pane = null;
		};
	});

	$effect(() => {
		shell.expand = shown ? null : { label: expandLabel, onclick: toggle };
		return () => {
			if (shell.expand?.onclick === toggle) shell.expand = null;
		};
	});

	// Covering the page, the pane takes focus, and gives it to the top bar's expand button when it closes.
	$effect(() => {
		if (!covers || !panel) return;
		const el = panel;
		el.focus();
		return () => {
			const active = document.activeElement;
			if (active && active !== document.body && !el.contains(active)) return;
			tick().then(() => shell.expandButton?.focus());
		};
	});

	function onkeydown(event: KeyboardEvent) {
		if (!covers || !panel) return;
		if (event.key === 'Escape' && !event.defaultPrevented) onclose();
		else keepFocusWithin(event, panel);
	}
</script>

{#if shown}
	<div class="fixed inset-0 z-20 bg-black/30 md:hidden" aria-hidden="true" onclick={onclose}></div>
{/if}

{#snippet aside()}
	<ContextBridge {contexts}>
		<aside
			bind:this={panel}
			tabindex="-1"
			role={covers ? 'dialog' : undefined}
			aria-modal={covers ? 'true' : undefined}
			aria-labelledby={shown ? titleId : undefined}
			aria-label={shown ? undefined : title}
			{onkeydown}
			class={[
				'relative flex h-full shrink-0 flex-col bg-base-100 outline-none',
				!pane.dragging && 'transition-[width] duration-200 ease-out motion-reduce:transition-none',
				shown ? ['border-r border-base-200', PANE_OVER_PAGE] : 'w-14 max-md:hidden'
			]}
			style:width={shown ? `min(${pane.size}px, 35vw)` : undefined}
		>
			{#if shown && !phone.current}
				<PaneResizer {pane} />
			{/if}
			<div
				class={[
					'flex h-16 shrink-0 items-center',
					shown ? 'justify-between pr-3 pl-6' : 'justify-center'
				]}
			>
				{#if shown}
					<h2 id={titleId} class="truncate text-[0.9375rem] font-semibold">{title}</h2>
				{/if}
				<div class="tooltip tooltip-right" data-tip={shown ? collapseLabel : expandLabel}>
					<button
						type="button"
						aria-label={shown ? collapseLabel : expandLabel}
						aria-expanded={shown}
						class="flex h-8 w-8 items-center justify-center rounded-md text-base-content/60 transition-colors hover:bg-base-200 hover:text-base-content"
						onclick={toggle}
					>
						<Icon
							icon={shown ? icons.layoutSidebarLeftCollapse : icons.layoutSidebarLeftExpand}
							class="h-5 w-5"
						/>
					</button>
				</div>
			</div>
			{#if shown}
				<div class="flex min-h-0 flex-1 flex-col">
					{@render children()}
				</div>
			{:else if rail}
				<div class="flex flex-col items-center gap-1">
					{@render rail()}
				</div>
			{/if}
		</aside>
	</ContextBridge>
{/snippet}
