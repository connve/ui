<script lang="ts">
	// Full-panel empty/error state with a brand glow. `notice` for "nothing
	// here yet", `oops` for a failed load.
	import Icon, { type IconifyIcon } from '@iconify/svelte';
	import * as icons from './icons.js';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { labels } from './labels.svelte.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		tone?: 'notice' | 'oops';
		/** `labels.stateNotice` or `labels.stateOops` when unset. */
		title?: string;
		message: string;
		icon?: string | IconifyIcon;
		/** Actions under the message, e.g. a retry button. */
		children?: Snippet;
	}

	let {
		tone = 'notice',
		title,
		message,
		icon,
		class: className,
		children,
		...rest
	}: Props = $props();

	let resolvedTitle = $derived(title ?? (tone === 'oops' ? labels.stateOops : labels.stateNotice));
	let resolvedIcon = $derived(icon ?? (tone === 'oops' ? icons.moodSad : icons.sparkles));
</script>

<!-- A failed load is announced as it appears. -->
<div
	role={tone === 'oops' ? 'alert' : undefined}
	{...rest}
	class={[
		'state-message relative flex min-h-full flex-1 flex-col items-center justify-center gap-3 px-6 py-16 text-center',
		className
	]}
>
	<div class="state-glow pointer-events-none absolute inset-0" aria-hidden="true">
		<div class="state-blob state-blob-1"></div>
		<div class="state-blob state-blob-2"></div>
		<div class="state-blob state-blob-3"></div>
	</div>

	<span class="state-icon relative flex h-12 w-12 items-center justify-center rounded-full">
		<Icon icon={resolvedIcon} class="h-6 w-6" />
	</span>

	<div class="relative">
		<h2 class="state-title text-lg font-semibold">{resolvedTitle}</h2>
		<p class="mt-1 max-w-md text-sm opacity-70">{message}</p>
	</div>

	{#if children}
		<div class="relative mt-2">{@render children()}</div>
	{/if}
</div>

<style>
	/* Brand glow — matches the agents hero. The theme sets its strength. */
	.state-glow {
		filter: blur(80px);
		opacity: var(--state-glow-opacity, 0.22);
	}
	/* The blobs sit around the centre of the message, so the glow is behind it
	   whatever the width of the page or the panes beside it. */
	.state-blob {
		position: absolute;
		top: 50%;
		left: 50%;
		border-radius: 9999px;
		mix-blend-mode: var(--state-glow-blend, multiply);
	}
	.state-blob-1 {
		width: min(30vw, 26rem);
		height: min(30vw, 26rem);
		transform: translate(-80%, -70%);
		background: radial-gradient(circle, #00e168 0%, transparent 70%);
	}
	.state-blob-2 {
		width: min(28vw, 24rem);
		height: min(28vw, 24rem);
		transform: translate(-20%, -55%);
		background: radial-gradient(circle, #00b4a6 0%, transparent 70%);
	}
	.state-blob-3 {
		width: min(26vw, 22rem);
		height: min(26vw, 22rem);
		transform: translate(-50%, -20%);
		background: radial-gradient(circle, #006b55 0%, transparent 75%);
	}

	.state-icon {
		background: color-mix(in oklab, var(--color-primary) 12%, transparent);
		color: var(--color-primary);
	}

	/* Accent-gradient title, matching connve.com's shimmering headline; the theme sets
	   stops that read on its base. */
	.state-title {
		background: var(--state-title);
		background-clip: text;
		-webkit-background-clip: text;
		color: transparent;
	}
</style>
