<script lang="ts">
	import Icon from '@iconify/svelte';
	import { codingAgents } from './codingAgents.js';
	import { x } from './icons.js';
	import { labels } from './labels.svelte.js';
	import { TOOLTIP_SIDE } from './tooltip.js';

	interface Props {
		/** Where agents are set up, such as the docs' Agent setup page. */
		href: string;
		/** The link's text, such as `Onboard your agents to Flowgen`. */
		label: string;
		/** Hides the link for good; without it the link has no close button. */
		ondismiss?: () => void;
		/** Names the close button, such as `Don't show this again`; `labels.close` when unset. */
		dismissLabel?: string;
	}

	let { href, label, ondismiss, dismissLabel }: Props = $props();
</script>

<div class="flex items-center gap-1">
	<a
		{href}
		target="_blank"
		rel="noopener"
		class="inline-flex items-center gap-2.5 text-sm font-medium text-base-content/60 transition-colors hover:text-base-content"
	>
		{label}
		<span class="flex items-center gap-1.5" aria-hidden="true">
			{#each codingAgents as agent (agent.anchor)}
				<span class={['tooltip flex', TOOLTIP_SIDE.bottom]} data-tip={agent.name}>
					<svg
						viewBox="0 0 24 24"
						class="h-4 w-4 transition-transform duration-150 hover:scale-150"
						fill="currentColor"
						fill-rule="evenodd"
					>
						<path d={agent.path} />
					</svg>
				</span>
			{/each}
		</span>
	</a>
	{#if ondismiss}
		<span class={['tooltip', TOOLTIP_SIDE.right]} data-tip={dismissLabel ?? labels.close}>
			<button
				type="button"
				class="flex h-6 w-6 items-center justify-center rounded-md text-base-content/60 transition-colors hover:bg-base-200 hover:text-base-content"
				aria-label={dismissLabel ?? labels.close}
				onclick={ondismiss}
			>
				<Icon icon={x} class="h-3.5 w-3.5" />
			</button>
		</span>
	{/if}
</div>
