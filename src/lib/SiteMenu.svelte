<script lang="ts">
	import Icon from '@iconify/svelte';
	import { tick, type Snippet } from 'svelte';
	import { prefersReducedMotion } from 'svelte/motion';
	import { fly } from 'svelte/transition';
	import type { HeaderLink } from './SiteHeader.svelte';
	import { keepFocusWithin } from './focus.js';
	import { x } from './icons.js';
	import { labels } from './labels.svelte.js';

	interface Props {
		/** Whether the menu shows; pair it with `SiteHeader`'s `menuOpen`. */
		open?: boolean;
		/** Site links for a small top row, when `children` holds the main navigation; leave
		 * empty to put the links in `children` instead. */
		links?: HeaderLink[];
		/** Gets focus back when the menu closes, usually `SiteHeader`'s `menuButton`. */
		returnFocus?: HTMLElement | null;
		/** Names the menu, for screen readers. */
		label?: string;
		/** Scrollable middle, such as a docs navigation. */
		children?: Snippet;
		/** Bottom row, such as the theme and language. */
		footer?: Snippet;
	}

	let {
		open = $bindable(false),
		links = [],
		returnFocus = null,
		label = labels.menu,
		children,
		footer
	}: Props = $props();

	const BUTTON =
		'flex h-8 w-8 items-center justify-center rounded-md text-base-content/60 transition-colors hover:bg-base-200 hover:text-base-content';

	let panel = $state<HTMLElement | null>(null);

	function close() {
		if (!open) return;
		open = false;
		returnFocus?.focus();
	}

	// Opening moves focus into the menu: the current page if it is listed, else
	// the first link.
	$effect(() => {
		if (!open) return;
		tick().then(() =>
			(
				panel?.querySelector<HTMLElement>('[aria-current="page"]') ??
				panel?.querySelector<HTMLElement>('a[href]')
			)?.focus({ preventScroll: true })
		);
	});

	// The page underneath doesn't scroll while the menu is open.
	$effect(() => {
		if (!open) return;
		const overflow = document.documentElement.style.overflow;
		document.documentElement.style.overflow = 'hidden';
		return () => {
			document.documentElement.style.overflow = overflow;
		};
	});

	function onkeydown(event: KeyboardEvent) {
		if (!panel) return;
		if (event.key === 'Escape') {
			close();
			return;
		}
		keepFocusWithin(event, panel);
	}

	// Following a link leaves the page, so the menu closes without taking focus back.
	function onclick(event: MouseEvent) {
		if ((event.target as Element).closest('a[href]')) open = false;
	}
</script>

<svelte:window onpopstate={() => (open = false)} />

{#if open}
	<div class="fixed inset-0 z-50 bg-black/30 md:hidden" aria-hidden="true" onclick={close}></div>
	<div
		bind:this={panel}
		role="dialog"
		aria-modal="true"
		aria-label={label}
		tabindex="-1"
		class="fixed top-0 left-0 z-50 flex h-dvh w-72 max-w-[85vw] flex-col bg-base-100 shadow-xl md:hidden"
		{onkeydown}
		{onclick}
		transition:fly={{ x: -288, duration: prefersReducedMotion.current ? 0 : 200, opacity: 1 }}
	>
		<div class="flex h-16 shrink-0 items-center justify-between px-4">
			{#if links.length > 0}
				<nav class="flex items-center gap-4 text-sm font-medium" aria-label={labels.navigation}>
					{#each links as link (link.href)}
						<a href={link.href} class="hover:text-primary">{link.label}</a>
					{/each}
				</nav>
			{/if}
			<button type="button" class={[BUTTON, 'ml-auto']} aria-label={labels.close} onclick={close}>
				<Icon icon={x} class="h-5 w-5" />
			</button>
		</div>
		<div class="min-h-0 flex-1 overflow-y-auto px-3 pt-1 pb-6">
			{@render children?.()}
		</div>
		{#if footer}
			<div class="flex shrink-0 items-center border-t border-base-200 px-4 py-3">
				{@render footer()}
			</div>
		{/if}
	</div>
{/if}
