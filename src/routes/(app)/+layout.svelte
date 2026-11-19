<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import Icon from '@iconify/svelte';
	import {
		AppShell,
		Logo,
		ThemeToggle,
		UpdateNotice,
		icons,
		type NavItem
	} from '../../lib/index.js';

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
	{#snippet railFooter({ compact }: { compact: boolean })}
		<div class={['flex w-full flex-col gap-2', compact && 'items-center']}>
			<UpdateNotice
				version="0.3.1"
				latest="0.3.2"
				command="npm install @connve/ui@latest"
				releaseNotes="https://www.npmjs.com/package/@connve/ui"
				{compact}
			/>
			<span
				class="flex h-8 w-8 items-center justify-center text-base-content/50"
				aria-label="Settings"
			>
				<Icon icon="tabler:adjustments" class="h-5 w-5" />
			</span>
		</div>
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
