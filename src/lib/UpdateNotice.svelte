<script lang="ts">
	import Icon from '@iconify/svelte';
	import CopyButton from './CopyButton.svelte';
	import { labels } from './labels.svelte.js';

	interface Props {
		/** The running version. */
		version: string;
		/** The newer release. */
		latest: string;
		/** The command that updates, shown with a copy button. */
		command?: string;
		/** What to do instead of a command, such as updating an image. */
		note?: string;
		/** The release notes of `latest`. */
		releaseNotes?: string;
		/** The rail is collapsed: the icon alone, named by its tooltip. */
		compact?: boolean;
	}

	let { version, latest, command, note, releaseNotes, compact = false }: Props = $props();

	let open = $state(false);
	let closeButton = $state<HTMLButtonElement | null>(null);

	$effect(() => {
		if (open) closeButton?.focus();
	});
</script>

<div
	class={compact ? 'tooltip tooltip-right' : 'w-full'}
	data-tip={compact ? labels.updateAvailable : undefined}
>
	<button
		type="button"
		class={[
			'flex h-8 items-center rounded-md text-primary transition-colors hover:bg-base-200',
			compact ? 'w-8 justify-center' : 'w-full gap-2 px-2 text-sm font-medium'
		]}
		aria-label={labels.updateAvailable}
		onclick={() => (open = true)}
	>
		<Icon icon="tabler:circle-arrow-up" class="h-5 w-5 shrink-0" />
		{#if !compact}
			<span class="truncate">{labels.updateAvailable}</span>
		{/if}
	</button>
</div>

{#if open}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
		role="dialog"
		aria-modal="true"
		aria-label={labels.updateAvailable}
		tabindex="-1"
		onclick={(e) => {
			if (e.target === e.currentTarget) open = false;
		}}
		onkeydown={(e) => {
			if (e.key !== 'Escape') return;
			e.stopPropagation();
			open = false;
		}}
	>
		<div class="w-full max-w-sm space-y-4 rounded-xl bg-base-100 p-5 shadow-2xl">
			<h2 class="text-[0.9375rem] font-semibold">{labels.updateAvailable}</h2>
			<p class="text-sm text-base-content/70">{labels.updateVersions(latest, version)}</p>
			{#if command}
				<div class="flex items-center justify-between gap-2 rounded-md bg-base-200 py-1 pr-1 pl-3">
					<code class="font-mono text-sm">{command}</code>
					<CopyButton text={command} />
				</div>
			{:else if note}
				<p class="text-sm">{note}</p>
			{/if}
			<div class="flex items-center justify-between gap-2">
				{#if releaseNotes}
					<a
						href={releaseNotes}
						target="_blank"
						rel="noopener noreferrer"
						class="text-sm text-base-content/70 hover:text-base-content"
					>
						{labels.releaseNotes}
					</a>
				{:else}
					<span></span>
				{/if}
				<button
					type="button"
					class="btn btn-ghost btn-sm"
					bind:this={closeButton}
					onclick={() => (open = false)}
				>
					{labels.close}
				</button>
			</div>
		</div>
	</div>
{/if}
