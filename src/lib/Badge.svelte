<script lang="ts">
	// Single badge style for the whole UI: uppercase, small.
	// - neutral: outlined, monochrome, faded (used for type tags: flow, sql, json).
	// - success/error/warning: filled soft (bg-*/10 + text-*) — same look as the
	//   Copied confirmation, reads strongly against row background.
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLSpanElement> {
		variant?: 'neutral' | 'success' | 'error' | 'warning';
		children: Snippet;
	}

	let { variant = 'neutral', class: className, children, ...rest }: Props = $props();

	const VARIANT = {
		neutral: 'border-current opacity-60',
		success: 'border-transparent bg-primary/10 text-(--color-chip-success)',
		error: 'border-transparent bg-error/10 text-(--color-chip-error)',
		warning: 'border-transparent bg-warning/10 text-attention'
	};
</script>

<span
	{...rest}
	class={[
		'inline-block rounded border px-1.5 py-0.5 text-[10px] leading-none font-semibold tracking-wider whitespace-nowrap uppercase',
		VARIANT[variant],
		className
	]}
>
	{@render children()}
</span>
