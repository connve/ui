<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLElement> {
		title?: string;
		children: Snippet;
	}

	let { title, class: className, children, ...rest }: Props = $props();
</script>

<section {...rest} class={['space-y-2', className]}>
	{#if title}
		<h3 class="text-xs font-medium text-base-content/60">{title}</h3>
	{/if}
	{@render children()}
</section>
