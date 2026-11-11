<script lang="ts" module>
	import type { IconifyIcon } from '@iconify/svelte';

	export interface NavItem {
		href: string;
		/** An Iconify name such as `tabler:home`, or icon data, which needs no request. */
		icon: string | IconifyIcon;
		label: string;
		active: boolean;
		/** A count shown on the item, such as unread conversations. */
		badge?: number;
		/** Names the item while it shows `badge`, e.g. "Agents, 2 unread"; `labels.navBadge` otherwise. */
		badgeLabel?: string;
	}
</script>

<script lang="ts">
	import Icon from '@iconify/svelte';
	import * as icons from './icons.js';
	import { onMount, untrack, type Snippet } from 'svelte';
	import { MediaQuery } from 'svelte/reactivity';
	import { keepFocusWithin } from './focus.js';
	import { labels } from './labels.svelte.js';
	import { MOBILE_QUERY } from './mobile.js';
	import { ShellState, setShell } from './shell.svelte.js';

	interface Props {
		/** The rail's links; each `href` must be unique. */
		nav: NavItem[];
		/** The logo at the top of the rail; it gives way to the expand button on hover while compact. */
		brand?: Snippet;
		/** The bottom of the rail, such as a version and a settings link. */
		railFooter?: Snippet<[{ compact: boolean }]>;
		/** The right side of the top bar. */
		actions?: Snippet;
		children: Snippet;
	}

	let { nav, brand, railFooter, actions, children }: Props = $props();

	const shell = setShell(new ShellState());

	const COLLAPSED_KEY = 'connve-nav-collapsed';

	let collapsed = $state(true);
	// On a phone the rail is a drawer, opened from the top bar and always full width. Open, it
	// covers the page, so it acts as a dialog. Crossing the phone breakpoint closes it.
	const phone = new MediaQuery(MOBILE_QUERY);
	let menuOpen = $derived.by(() => {
		void phone.current;
		return false;
	});
	let compact = $derived(collapsed && !menuOpen);
	let rail = $state<HTMLElement | null>(null);
	let menuButton = $state<HTMLButtonElement | null>(null);

	$effect(() => {
		if (menuOpen) untrack(() => rail?.querySelector<HTMLElement>('nav a[href]')?.focus());
	});

	onMount(() => {
		try {
			const saved = localStorage.getItem(COLLAPSED_KEY);
			if (saved !== null) collapsed = saved === '1';
		} catch {
			// The rail starts collapsed.
		}
	});

	function toggle() {
		collapsed = !collapsed;
		try {
			localStorage.setItem(COLLAPSED_KEY, collapsed ? '1' : '0');
		} catch {
			// Not remembered, but the rail still changes for this visit.
		}
	}

	// Any link in the drawer navigates away from it, including the app's own in `brand` and `railFooter`.
	function closeOnLink(event: MouseEvent) {
		if (event.target instanceof Element && event.target.closest('a[href]')) menuOpen = false;
	}

	function closeMenu() {
		menuOpen = false;
		menuButton?.focus();
	}

	function onRailKeydown(event: KeyboardEvent) {
		if (!menuOpen || !rail) return;
		if (event.key === 'Escape') closeMenu();
		else keepFocusWithin(event, rail);
	}

	const BUTTON =
		'flex h-8 w-8 items-center justify-center rounded-md text-base-content/60 transition-colors hover:bg-base-200 hover:text-base-content';
</script>

<svelte:window onpopstate={() => (menuOpen = false)} />

<div class="min-h-screen overflow-x-hidden bg-base-100 text-base-content">
	<div class="flex min-h-screen w-full min-w-0">
		{#if menuOpen}
			<div
				class="fixed inset-0 z-30 bg-black/30 md:hidden"
				aria-hidden="true"
				onclick={closeMenu}
			></div>
		{/if}
		<div
			bind:this={rail}
			role={menuOpen ? 'dialog' : undefined}
			aria-modal={menuOpen ? 'true' : undefined}
			aria-label={menuOpen ? labels.menu : undefined}
			onclick={closeOnLink}
			onkeydown={onRailKeydown}
			class={[
				'flex shrink-0 flex-col border-r border-base-200 bg-base-100 transition-[width] duration-200 ease-out motion-reduce:transition-none',
				menuOpen
					? 'max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:z-40 max-md:w-64 max-md:shadow-xl'
					: 'max-md:hidden',
				compact ? 'w-16' : 'w-56'
			]}
		>
			<div
				class={[
					'group relative flex h-16 shrink-0 items-center',
					compact ? 'justify-center' : 'justify-between pr-3 pl-6'
				]}
			>
				{#if brand}
					<div
						class={[
							'flex h-10 items-center transition-opacity',
							compact && 'md:group-hover:opacity-0 md:group-has-[button:focus-visible]:opacity-0'
						]}
					>
						{@render brand()}
					</div>
				{/if}
				<div
					class={[
						'tooltip tooltip-right max-md:hidden',
						compact &&
							brand &&
							'absolute inset-0 m-auto h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100 has-[button:focus-visible]:opacity-100'
					]}
					data-tip={collapsed ? labels.navExpand : labels.navCollapse}
				>
					<button
						type="button"
						aria-label={collapsed ? labels.navExpand : labels.navCollapse}
						aria-expanded={!collapsed}
						class={BUTTON}
						onclick={toggle}
					>
						<Icon
							icon={collapsed ? icons.layoutSidebarLeftExpand : icons.layoutSidebarLeftCollapse}
							class="h-5 w-5"
						/>
					</button>
				</div>
			</div>

			<nav
				aria-label={labels.navigation}
				class={[
					'flex-1 space-y-px pb-2 max-md:pt-2',
					compact ? 'flex flex-col items-center' : 'px-3'
				]}
			>
				{#each nav as item (item.href)}
					{@const label = item.badge
						? (item.badgeLabel ?? labels.navBadge(item.label, item.badge))
						: item.label}
					<!-- The tooltip wraps the link, so it shows on keyboard focus too. -->
					<div class={[compact && 'tooltip tooltip-right']} data-tip={compact ? label : undefined}>
						<a
							href={item.href}
							class={[
								'relative flex h-9 items-center rounded-md text-sm transition-colors',
								item.active
									? 'bg-base-200 font-semibold text-base-content'
									: 'font-medium text-base-content/70 hover:bg-base-200/60 hover:text-base-content',
								compact ? 'w-9 justify-center' : 'gap-3 px-3'
							]}
							aria-label={label}
							aria-current={item.active ? 'page' : undefined}
						>
							<Icon icon={item.icon} class="h-5 w-5 shrink-0" />
							{#if !compact}
								<span>{item.label}</span>
							{/if}
							{#if item.badge}
								<span
									class={[
										'badge badge-primary',
										compact ? 'absolute -top-1 -right-1 min-w-4 px-1 badge-xs' : 'ml-auto badge-sm'
									]}
								>
									{item.badge}
								</span>
							{/if}
						</a>
					</div>
				{/each}
			</nav>

			{#if railFooter}
				<div class={['flex h-12 shrink-0 items-center', compact ? 'justify-center' : 'px-6']}>
					{@render railFooter({ compact })}
				</div>
			{/if}
		</div>

		{#if shell.pane}
			<div class="relative flex h-screen shrink-0">
				{@render shell.pane()}
			</div>
		{/if}

		<div class="flex min-w-0 flex-1 flex-col bg-base-100">
			<header class="flex h-16 items-center justify-between gap-3 px-4 md:px-6">
				<div class="flex items-center">
					<button
						bind:this={menuButton}
						type="button"
						class="{BUTTON} md:hidden"
						aria-label={labels.menu}
						aria-expanded={menuOpen}
						onclick={() => (menuOpen = true)}
					>
						<Icon icon={icons.menu2} class="h-5 w-5" />
					</button>
					{#if shell.expand}
						<button
							bind:this={shell.expandButton}
							type="button"
							class="{BUTTON} md:hidden"
							aria-label={shell.expand.label}
							aria-expanded="false"
							onclick={shell.expand.onclick}
						>
							<Icon icon={icons.layoutSidebarLeftExpand} class="h-5 w-5" />
						</button>
					{/if}
				</div>
				<div class="flex items-center justify-end gap-3">
					{@render actions?.()}
				</div>
			</header>

			<main class="min-w-0 flex-1 overflow-hidden bg-base-100">
				{@render children()}
			</main>
		</div>
	</div>
</div>
