<script lang="ts">
	import Icon, { type IconifyIcon } from '@iconify/svelte';
	import * as icons from './icons.js';
	import { labels } from './labels.svelte.js';
	import { theme, type ThemePref } from './theme.svelte.js';

	let options = $derived<{ pref: ThemePref; icon: IconifyIcon; label: string }[]>([
		{ pref: 'system', icon: icons.deviceDesktop, label: labels.themeSystem },
		{ pref: 'light', icon: icons.sun, label: labels.themeLight },
		{ pref: 'dark', icon: icons.moon, label: labels.themeDark }
	]);
</script>

<div
	class="flex items-center gap-0.5 rounded-full border border-base-300 bg-base-200/50 p-0.5"
	role="group"
	aria-label={labels.theme}
>
	{#each options as option (option.pref)}
		<div class="tooltip tooltip-bottom" data-tip={option.label}>
			<button
				type="button"
				class={[
					'flex h-7 w-7 items-center justify-center rounded-full transition-colors',
					theme.pref === option.pref
						? 'bg-base-100 text-primary shadow-sm'
						: 'text-base-content/60 hover:text-base-content'
				]}
				aria-label={labels.themeOption(option.label)}
				aria-pressed={theme.pref === option.pref}
				onclick={() => theme.set(option.pref)}
			>
				<Icon icon={option.icon} class="h-4 w-4" />
			</button>
		</div>
	{/each}
</div>
