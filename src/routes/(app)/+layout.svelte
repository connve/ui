<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { AppShell, Logo, ThemeToggle, icons, type NavItem } from '../../lib/index.js';

	let { children } = $props();

	let nav = $derived<NavItem[]>([
		{
			href: resolve('/(app)'),
			icon: 'tabler:components',
			label: 'Components',
			active: page.url.pathname === resolve('/(app)')
		},
		{
			href: resolve('/(app)/shell'),
			icon: 'tabler:layout-sidebar',
			label: 'Side pane',
			active: page.url.pathname === resolve('/(app)/shell'),
			badge: 2,
			badgeLabel: 'Side pane, 2 new'
		},
		{
			href: resolve('/site'),
			icon: icons.fileText,
			label: 'Public site',
			active: false
		}
	]);
</script>

<AppShell {nav}>
	{#snippet brand()}
		<a href={resolve('/(app)')} class="text-primary" aria-label="Home"
			><Logo class="h-6 w-auto" /></a
		>
	{/snippet}
	{#snippet actions()}
		<div class="max-sm:hidden">
			<ThemeToggle />
		</div>
	{/snippet}
	{#snippet menuFooter()}
		<ThemeToggle />
	{/snippet}
	{@render children()}
</AppShell>
