<script lang="ts">
	import Icon from '@iconify/svelte';
	import { FIELD } from './dropdown.js';
	import { x } from './icons.js';
	import { labels } from './labels.svelte.js';

	interface Props {
		value: string[];
		label: string;
		placeholder?: string;
		onchange: (value: string[]) => void;
	}

	let { value, label, placeholder, onchange }: Props = $props();

	const id = $props.id();
	let draft = $state('');

	function add() {
		const tokens = draft
			.split(',')
			.map((token) => token.trim())
			.filter(
				(token, index, all) => token && !value.includes(token) && all.indexOf(token) === index
			);
		draft = '';
		if (tokens.length > 0) onchange([...value, ...tokens]);
	}

	function onkeydown(event: KeyboardEvent) {
		if (event.isComposing) return;
		switch (event.key) {
			case 'Backspace':
				if (draft === '' && value.length > 0) onchange(value.slice(0, -1));
				break;
			case 'Enter':
			case ',':
				event.preventDefault();
				add();
				break;
		}
	}
</script>

<label for={id} class="{FIELD} h-auto min-h-8 flex-wrap gap-1 py-1">
	{#each value as token, index (index)}
		<span
			class="flex items-center gap-1 rounded-full bg-base-200 py-0.5 pr-1 pl-2 text-xs text-base-content/70"
		>
			{token}
			<button
				type="button"
				class="flex rounded-full hover:text-base-content"
				aria-label={labels.remove(token)}
				onclick={() => onchange(value.filter((_, at) => at !== index))}
			>
				<Icon icon={x} class="h-3 w-3" />
			</button>
		</span>
	{/each}
	<input
		{id}
		type="text"
		class="min-w-24 grow"
		aria-label={label}
		placeholder={value.length === 0 ? placeholder : undefined}
		bind:value={draft}
		{onkeydown}
		onblur={add}
		onpaste={(event) => {
			const pasted = event.clipboardData?.getData('text') ?? '';
			if (!pasted.includes(',')) return;
			event.preventDefault();
			draft += pasted;
			add();
		}}
	/>
</label>
