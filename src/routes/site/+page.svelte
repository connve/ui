<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import {
		NewsletterSignup,
		SearchPalette,
		SearchTrigger,
		SiteFooter,
		SiteHeader,
		SiteMenu,
		ThemeToggle,
		codeCopy,
		isSearchShortcut,
		type HeaderLink
	} from '../../lib/index.js';

	interface Page {
		title: string;
		section: string;
		path: string;
	}

	const LINKS: HeaderLink[] = [
		{ href: resolve('/(app)'), label: 'Components' },
		{ href: resolve('/(app)/shell'), label: 'Side pane' },
		{ href: resolve('/site'), label: 'Public site' }
	];

	const PAGES: Page[] = [
		{ title: 'Getting started', section: 'Guides', path: '#start' },
		{ title: 'Configuration', section: 'Guides', path: '#config' },
		{ title: 'AppShell', section: 'Components', path: '#shell' },
		{ title: 'SiteHeader', section: 'Components', path: '#header' }
	];

	let menuOpen = $state(false);
	let menuButton = $state<HTMLButtonElement | null>(null);
	let searching = $state(false);
	let query = $state('');
	let subscribed = $state<string | null>(null);

	let groups = $derived.by(() => {
		const q = query.trim().toLowerCase();
		const hits = PAGES.filter((p) => !q || p.title.toLowerCase().includes(q));
		const bySection: [string, Page[]][] = [];
		for (const hit of hits) {
			const group = bySection.find(([section]) => section === hit.section);
			if (group) group[1].push(hit);
			else bySection.push([hit.section, [hit]]);
		}
		return bySection;
	});

	function onkeydown(event: KeyboardEvent) {
		if (!isSearchShortcut(event)) return;
		event.preventDefault();
		searching = !searching;
	}
</script>

<svelte:window {onkeydown} />

<div class="min-h-screen bg-base-100 text-base-content">
	<SiteHeader
		home={resolve('/site')}
		homeLabel="Showcase home"
		label="Docs"
		links={LINKS}
		onmenu={() => (menuOpen = true)}
		{menuOpen}
		bind:menuButton
	>
		{#snippet actions()}
			<SearchTrigger placeholder="Search docs…" onclick={() => (searching = true)} />
			<div class="max-sm:hidden">
				<ThemeToggle />
			</div>
		{/snippet}
	</SiteHeader>

	<SiteMenu bind:open={menuOpen} links={LINKS} returnFocus={menuButton} label="Documentation">
		<ul class="space-y-1 text-sm">
			{#each PAGES as item (item.path)}
				<li>
					<a href={item.path} class="block rounded-md px-2 py-1.5 hover:bg-base-200">{item.title}</a
					>
				</li>
			{/each}
		</ul>
		{#snippet footer()}
			<ThemeToggle />
		{/snippet}
	</SiteMenu>

	<SearchPalette
		bind:open={searching}
		bind:query
		{groups}
		href={(item) => item.path}
		key={(item) => item.path}
		onchoose={(item) => goto(item.path)}
	>
		{#snippet row(item)}
			<span class="flex-1">{item.title}</span>
			<span class="text-xs text-base-content/60">{item.section}</span>
		{/snippet}
	</SearchPalette>

	<main class="mx-auto max-w-[90rem] px-4 py-10 md:px-6">
		<article class="prose" {@attach codeCopy()}>
			<h1>Public pages</h1>
			<p>
				The header, its menu on a phone, search (<kbd>⌘K</kbd>), long-form text with copyable code,
				the newsletter and the footer, as the docs and the website use them.
			</p>
			<h2 id="start">Getting started</h2>
			<p>Install the package with its peers:</p>
			<pre><code>npm install @connve/ui @iconify/svelte daisyui tailwindcss</code></pre>
			<h2 id="config">Configuration</h2>
			<ul>
				<li>Import <code>theme.css</code> after Tailwind and daisyUI.</li>
				<li>Start the theme once in the root layout.</li>
			</ul>
			<blockquote>Prose styles come from <code>prose.css</code>.</blockquote>
		</article>
		{#if subscribed}
			<p class="mt-6 text-sm text-base-content/60">Subscribed: {subscribed}</p>
		{/if}
	</main>

	<NewsletterSignup onsubscribe={(email) => (subscribed = email)} />
	<SiteFooter />
</div>
