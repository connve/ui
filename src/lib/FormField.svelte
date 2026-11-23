<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { Snippet } from 'svelte';
	import { formHelp } from './formHelp.svelte.js';
	import { infoCircle } from './icons.js';
	import { labels } from './labels.svelte.js';

	interface Props {
		label: string;
		required?: boolean;
		help?: string;
		children: Snippet;
	}

	let { label, required = false, help, children }: Props = $props();

	const id = $props.id();
	let open = $derived(formHelp.open === id);
</script>

<div class="space-y-1">
	<div class="flex items-center gap-1">
		<span class="text-xs font-medium text-base-content/70">{label}</span>
		{#if required}
			<span class="text-xs text-error" aria-hidden="true">*</span>
			<span class="sr-only">{labels.required}</span>
		{/if}
		{#if help}
			<button
				type="button"
				aria-label={labels.fieldHelp}
				aria-expanded={open}
				class={[
					'flex hover:text-base-content/70',
					open ? 'text-base-content/70' : 'text-base-content/40'
				]}
				onclick={() => (formHelp.open = open ? null : id)}
			>
				<Icon icon={infoCircle} class="h-3.5 w-3.5" />
			</button>
		{/if}
	</div>
	{#if open}
		<p class="text-xs text-base-content/60">{help}</p>
	{/if}
	{@render children()}
</div>
