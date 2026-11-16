<script lang="ts" generics="T">
	import Icon from '@iconify/svelte';
	import { tick, untrack, type Snippet } from 'svelte';
	import { keepFocusWithin } from './focus.js';
	import { search } from './icons.js';
	import { labels } from './labels.svelte.js';

	interface Props {
		open: boolean;
		/** What the reader typed; the app turns it into `groups`. */
		query: string;
		/** Results by group title, in order. */
		groups: [string, T[]][];
		href: (item: T) => string;
		key: (item: T) => string;
		/** Opens a result chosen with Enter; a click follows its link. */
		onchoose: (item: T) => void;
		/** A result row, laid out in a flex row. */
		row: Snippet<[T]>;
		placeholder?: string;
		loading?: boolean;
		/** Shown without results; `labels.searchEmpty` when unset. */
		empty?: string;
	}

	let {
		open = $bindable(false),
		query = $bindable(''),
		groups,
		href,
		key,
		onchoose,
		row,
		placeholder,
		loading = false,
		empty
	}: Props = $props();

	let active = $state(0);
	let input = $state<HTMLInputElement | null>(null);
	let dialog = $state<HTMLElement | null>(null);
	const id = $props.id();

	let flat = $derived(groups.flatMap(([, items]) => items));

	// Opening takes focus into the input and locks the page's scroll; closing gives both back.
	$effect(() => {
		if (!open) return;
		const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		untrack(() => {
			query = '';
			active = 0;
		});
		void tick().then(() => input?.focus());
		const overflow = document.documentElement.style.overflow;
		document.documentElement.style.overflow = 'hidden';
		return () => {
			document.documentElement.style.overflow = overflow;
			opener?.focus();
		};
	});

	$effect(() => {
		if (active >= flat.length) active = Math.max(0, flat.length - 1);
	});

	function close() {
		open = false;
	}

	function onkeydown(event: KeyboardEvent) {
		switch (event.key) {
			case 'ArrowDown':
			case 'ArrowUp': {
				event.preventDefault();
				if (flat.length === 0) return;
				const step = event.key === 'ArrowDown' ? 1 : -1;
				active = (active + step + flat.length) % flat.length;
				void tick().then(() =>
					document.getElementById(`${id}-${active}`)?.scrollIntoView({ block: 'nearest' })
				);
				break;
			}
			case 'Enter': {
				event.preventDefault();
				const item = flat[active];
				if (item === undefined) return;
				close();
				onchoose(item);
				break;
			}
			case 'Escape':
				event.preventDefault();
				event.stopPropagation();
				close();
				break;
		}
	}
</script>

{#if open}
	<div class="fixed inset-0 z-50 bg-black/30" aria-hidden="true" onclick={close}></div>
	<div
		class="fixed top-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 overflow-hidden rounded-lg border border-base-200 bg-base-100 shadow-xl md:top-24"
		bind:this={dialog}
		tabindex="-1"
		role="dialog"
		aria-modal="true"
		aria-label={labels.search}
		onkeydown={(event) => dialog && keepFocusWithin(event, dialog)}
	>
		<div class="flex items-center gap-2 border-b border-base-200 px-4">
			<Icon icon={search} class="h-4 w-4 shrink-0 opacity-50" />
			<input
				bind:this={input}
				bind:value={query}
				{onkeydown}
				oninput={() => (active = 0)}
				type="text"
				class="h-12 w-full bg-transparent text-sm outline-none"
				placeholder={placeholder ?? labels.searchPlaceholder}
				role="combobox"
				aria-expanded="true"
				aria-controls="{id}-results"
				aria-activedescendant={flat.length > 0 ? `${id}-${active}` : undefined}
				autocomplete="off"
				spellcheck="false"
			/>
			{#if loading}
				<span class="loading loading-xs loading-spinner text-primary"></span>
			{/if}
		</div>
		<ul id="{id}-results" class="max-h-[min(28rem,70dvh)] overflow-y-auto p-1" role="listbox">
			{#each groups as [title, items] (title)}
				<li role="presentation" class="px-3 pt-2 pb-1 text-xs font-medium text-base-content/60">
					{title}
				</li>
				{#each items as item (key(item))}
					{@const index = flat.indexOf(item)}
					<li role="presentation">
						<a
							id="{id}-{index}"
							href={href(item)}
							role="option"
							aria-selected={index === active}
							tabindex="-1"
							class={[
								'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm',
								index === active && 'bg-base-200'
							]}
							onmousemove={() => (active = index)}
							onclick={close}
						>
							{@render row(item)}
						</a>
					</li>
				{/each}
			{:else}
				<li class="px-3 py-6 text-center text-sm text-base-content/60">
					{loading ? labels.loading : (empty ?? labels.searchEmpty)}
				</li>
			{/each}
		</ul>
	</div>
{/if}
