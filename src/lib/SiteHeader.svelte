<script lang="ts" module>
	/** A link in the site header. */
	export interface HeaderLink {
		href: string;
		label: string;
	}
</script>

<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { Snippet } from 'svelte';
	import Logo from './Logo.svelte';
	import Wordmark from './Wordmark.svelte';
	import { menu2 } from './icons.js';
	import { labels } from './labels.svelte.js';

	interface Props {
		/** Where the logo links. */
		home: string;
		/** Names the home link, for screen readers. */
		homeLabel: string;
		/** Text after the logo, such as `Docs`. */
		label?: string;
		links?: HeaderLink[];
		/** Opens the menu on small screens; without it the header has no menu button. */
		onmenu?: () => void;
		menuOpen?: boolean;
		menuButton?: HTMLButtonElement | null;
		/** Right of the links, such as search, language and theme. */
		actions?: Snippet;
		/** The width of the page the header sits over. */
		class?: string;
	}

	let {
		home,
		homeLabel,
		label,
		links = [],
		onmenu,
		menuOpen = false,
		menuButton = $bindable(null),
		actions,
		class: className = 'mx-auto max-w-[90rem] px-4 md:px-6'
	}: Props = $props();

	// At the top the wordmark shows; once the page scrolls, the bar fills and
	// shows the mark, whose dots run a wave while scrolling continues.
	let scrollY = $state(0);
	let scrolled = $derived(scrollY > 24);
	let beat = $state(0);
	$effect(() => {
		if (scrolled) beat = scrollY;
	});
</script>

<svelte:window bind:scrollY />

<header class={['site-header sticky top-0 z-40', scrolled && 'scrolled']}>
	<div class={[className, 'flex h-16 items-center gap-2']}>
		{#if onmenu}
			<button
				bind:this={menuButton}
				type="button"
				class="-ml-1 flex h-8 w-8 items-center justify-center rounded-md text-base-content/60 transition-colors hover:bg-base-200 hover:text-base-content md:hidden"
				aria-label={labels.menu}
				aria-expanded={menuOpen}
				onclick={onmenu}
			>
				<Icon icon={menu2} class="h-5 w-5" />
			</button>
		{/if}
		<a href={home} aria-label={homeLabel} class="flex items-center gap-2.5">
			<span class="brand">
				<Wordmark class="wordmark h-6 w-auto text-primary" />
				<span class="mark text-primary"><Logo class="h-6 w-auto" {beat} /></span>
			</span>
			{#if label}
				<span class="text-[15px] font-semibold tracking-tight text-base-content">{label}</span>
			{/if}
		</a>
		<div class="ml-auto flex items-center gap-6">
			{#if links.length > 0}
				<nav class="hidden items-center gap-6 md:flex" aria-label={labels.navigation}>
					{#each links as link (link.href)}
						<a href={link.href} class="nav-pill">{link.label}</a>
					{/each}
				</nav>
			{/if}
			{#if actions}
				<div class="flex items-center gap-2">{@render actions()}</div>
			{/if}
		</div>
	</div>
</header>

<style>
	.site-header {
		border-bottom: 1px solid transparent;
		transition:
			background-color 0.3s ease,
			border-color 0.3s ease;
	}
	.site-header.scrolled {
		background: color-mix(in oklab, var(--color-base-100) 82%, transparent);
		border-color: var(--color-base-200);
		backdrop-filter: blur(12px);
	}

	/* The wordmark and the mark share one spot and cross-fade; the spot
	   narrows to the mark so a label follows it. */
	.brand {
		position: relative;
		display: inline-flex;
		align-items: center;
		width: 7.5rem;
		height: 1.5rem;
		transition: width 0.3s ease;
	}
	.scrolled .brand {
		width: 2.35rem;
	}
	.brand :global(.wordmark),
	.mark {
		transition: opacity 0.3s ease;
	}
	.mark {
		position: absolute;
		left: 0;
		opacity: 0;
		pointer-events: none;
	}
	.scrolled .brand :global(.wordmark) {
		opacity: 0;
	}
	.scrolled .mark {
		opacity: 1;
	}

	.nav-pill {
		position: relative;
		display: inline-flex;
		align-items: center;
		padding: 0.5rem 0.25rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: inherit;
		transition: color 0.15s ease;
	}
	.nav-pill + .nav-pill::before {
		content: '|';
		position: absolute;
		left: -0.875rem;
		color: color-mix(in oklab, var(--color-base-content) 20%, transparent);
		font-weight: 300;
		pointer-events: none;
	}
	.nav-pill::after {
		content: '';
		position: absolute;
		left: 0.25rem;
		right: 0.25rem;
		bottom: 0.25rem;
		height: 2px;
		background-color: var(--color-primary);
		transform: scaleX(0);
		transform-origin: left center;
		transition: transform 0.2s ease;
	}
	.nav-pill:hover {
		color: var(--color-primary);
	}
	.nav-pill:hover::after {
		transform: scaleX(1);
	}
	@media (prefers-reduced-motion: reduce) {
		.site-header,
		.brand,
		.brand :global(.wordmark),
		.mark,
		.nav-pill::after {
			transition: none;
		}
	}
</style>
