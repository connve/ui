<script lang="ts">
	import Icon from '@iconify/svelte';
	import * as icons from './icons.js';
	import { labels } from './labels.svelte.js';

	interface Props {
		/** Names the whole list, e.g. "All flows". */
		allLabel: string;
		/** The open folder, shown as a breadcrumb after `allLabel`. */
		folder: string | null;
		onselect: (folder: string | null) => void;
		/** The number of items shown, e.g. "26 flows". */
		count: string;
		/** Where New leads, or null for no New. */
		newHref: string | null;
	}

	let { allLabel, folder, onselect, count, newHref }: Props = $props();

	let segments = $derived(folder ? folder.split('/') : []);

	const ANCESTOR = 'shrink-0 text-base-content/60 transition-colors hover:text-base-content';
</script>

<!-- Lives in an `@container` column, so it folds to what fits beside an inspector. -->
<div class="flex min-h-8 items-center justify-between gap-3">
	<div class="flex min-w-0 items-baseline gap-1.5 text-[0.9375rem] font-semibold whitespace-nowrap">
		<nav aria-label={labels.breadcrumb} class="flex min-w-0 items-baseline gap-1.5">
			{#if folder}
				<button type="button" class={ANCESTOR} onclick={() => onselect(null)}>{allLabel}</button>
				{#each segments as segment, i (i)}
					<span class="shrink-0 opacity-40" aria-hidden="true">/</span>
					{#if i < segments.length - 1}
						<button
							type="button"
							class={ANCESTOR}
							onclick={() => onselect(segments.slice(0, i + 1).join('/'))}
						>
							{segment}
						</button>
					{:else}
						<span class="truncate" aria-current="location">{segment}</span>
					{/if}
				{/each}
			{:else}
				<span class="truncate" aria-current="location">{allLabel}</span>
			{/if}
		</nav>
		<span class="shrink-0 text-xs font-normal opacity-60 @max-sm:hidden">· {count}</span>
	</div>
	{#if newHref !== null}
		<a href={newHref} class="btn shrink-0 gap-1.5 btn-primary btn-sm">
			<Icon icon={icons.plus} class="h-4 w-4" />
			{labels.new}
		</a>
	{/if}
</div>
