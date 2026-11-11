<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { AppShell, Logo, ThemeToggle, theme, type NavItem } from '../lib/index.js';
	import '../app.css';

	let { children } = $props();

	onMount(() => theme.start());

	let nav = $derived<NavItem[]>([
		{
			href: resolve('/'),
			icon: 'tabler:components',
			label: 'Components',
			active: page.url.pathname === resolve('/')
		},
		{
			href: resolve('/shell'),
			icon: 'tabler:layout-sidebar',
			label: 'Side pane',
			active: page.url.pathname === resolve('/shell'),
			badge: 2,
			badgeLabel: 'Side pane, 2 new'
		}
	]);
</script>

<AppShell {nav}>
	{#snippet brand()}
		<a href={resolve('/')} class="text-primary" aria-label="Home"><Logo class="h-6 w-auto" /></a>
	{/snippet}
	{#snippet actions()}
		<ThemeToggle />
	{/snippet}
	{@render children()}
</AppShell>
