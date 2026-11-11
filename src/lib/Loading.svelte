<script lang="ts">
	// Spinner centred in the panel it fills, shown while a page or inspector loads.
	import type { HTMLAttributes } from 'svelte/elements';
	import { labels } from './labels.svelte.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		size?: 'md' | 'lg';
		/** Says what is loading to screen readers; `labels.loading` when unset. */
		label?: string;
	}

	let { size = 'lg', label, class: className, ...rest }: Props = $props();
</script>

<div
	{...rest}
	role="status"
	class={['flex min-h-full flex-1 items-center justify-center py-12', className]}
>
	<span
		class={['loading loading-spinner text-primary', size === 'lg' ? 'loading-lg' : 'loading-md']}
		aria-hidden="true"
	></span>
	<span class="sr-only">{label ?? labels.loading}</span>
</div>
