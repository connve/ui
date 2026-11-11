<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	type Variant = 'neutral' | 'success' | 'warning' | 'error';

	interface Props extends HTMLAttributes<HTMLSpanElement> {
		variant?: Variant;
		/** The status in words; the dot only repeats it. */
		label: string;
	}

	let { variant = 'neutral', label, class: className, ...rest }: Props = $props();

	const DOT: Record<Variant, string> = {
		neutral: 'bg-base-content/30',
		success: 'bg-primary',
		warning: 'bg-warning',
		error: 'bg-error'
	};
</script>

<span
	{...rest}
	class={[
		'inline-flex items-center gap-1.5 whitespace-nowrap',
		variant === 'error' && 'text-error',
		className
	]}
>
	<span class={['h-2 w-2 shrink-0 rounded-full', DOT[variant]]} aria-hidden="true"></span>
	{label}
</span>
