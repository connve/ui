<script lang="ts">
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import { search } from './icons.js';
	import { labels } from './labels.svelte.js';
	import { SEARCH_KEYS, searchShortcut } from './search.js';

	interface Props {
		onclick: () => void;
		/** The bar's text; `labels.searchPlaceholder` when unset. */
		placeholder?: string;
	}

	let { onclick, placeholder }: Props = $props();

	let shortcut = $state('');
	onMount(() => (shortcut = searchShortcut()));
</script>

<button
	type="button"
	class="flex h-8 w-64 items-center gap-2 rounded-md border border-base-300 bg-base-200/50 px-2.5 text-sm text-base-content/60 transition-colors hover:border-base-content/30 hover:text-base-content max-md:hidden"
	aria-label={labels.search}
	aria-keyshortcuts={SEARCH_KEYS}
	{onclick}
>
	<Icon icon={search} class="h-4 w-4 shrink-0" />
	<span class="truncate">{placeholder ?? labels.searchPlaceholder}</span>
	{#if shortcut}
		<kbd
			class="ml-auto rounded border border-base-300 bg-base-100 px-1.5 py-0.5 font-sans text-[10px] leading-none font-medium"
			>{shortcut}</kbd
		>
	{/if}
</button>
<button
	type="button"
	class="flex h-8 w-8 items-center justify-center rounded-md text-base-content/60 transition-colors hover:bg-base-200 hover:text-base-content md:hidden"
	aria-label={labels.search}
	aria-keyshortcuts={SEARCH_KEYS}
	{onclick}
>
	<Icon icon={search} class="h-5 w-5" />
</button>
