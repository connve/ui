<script lang="ts">
	import Icon from '@iconify/svelte';
	import { tick } from 'svelte';
	import { selector } from './icons.js';
	import { FIELD, LIST, OPTION, placement } from './dropdown.js';

	interface Option {
		value: string;
		label?: string;
		description?: string;
	}

	interface Props {
		value: string;
		options: Option[];
		label: string;
		placeholder?: string;
		onchange: (value: string) => void;
	}

	let { value, options, label, placeholder = '', onchange }: Props = $props();

	const id = $props.id();
	let selected = $derived(options.find((option) => option.value === value));
	let open = $state(false);
	let active = $state(0);
	let side = $state('');
	let root = $state<HTMLDivElement | null>(null);

	function show() {
		if (options.length === 0) return;
		active = Math.max(
			0,
			options.findIndex((option) => option.value === value)
		);
		side = placement(root);
		open = true;
		void tick().then(() =>
			document.getElementById(`${id}-${active}`)?.scrollIntoView({ block: 'nearest' })
		);
	}

	function choose(option: Option) {
		open = false;
		if (option.value !== value) onchange(option.value);
	}

	function onkeydown(event: KeyboardEvent) {
		switch (event.key) {
			case 'ArrowDown':
			case 'ArrowUp': {
				event.preventDefault();
				if (!open) return show();
				const step = event.key === 'ArrowDown' ? 1 : -1;
				active = (active + step + options.length) % options.length;
				document.getElementById(`${id}-${active}`)?.scrollIntoView({ block: 'nearest' });
				break;
			}
			case 'Enter':
			case ' ':
				event.preventDefault();
				if (open && options[active]) choose(options[active]);
				else show();
				break;
			case 'Escape':
				if (!open) return;
				event.stopPropagation();
				open = false;
				break;
		}
	}
</script>

<div
	class="relative"
	bind:this={root}
	onfocusout={(event) => {
		if (!root?.contains(event.relatedTarget as Node | null)) open = false;
	}}
>
	<button
		type="button"
		class="{FIELD} cursor-pointer justify-between text-left"
		role="combobox"
		aria-label={label}
		aria-expanded={open}
		aria-controls="{id}-options"
		aria-activedescendant={open ? `${id}-${active}` : undefined}
		onclick={(event) => {
			event.currentTarget.focus();
			if (open) open = false;
			else show();
		}}
		{onkeydown}
	>
		<span class={['truncate', !value && !selected?.label && 'text-base-content/40']}>
			{selected?.label ?? (value || placeholder)}
		</span>
		<Icon icon={selector} class="h-4 w-4 shrink-0 text-base-content/40" />
	</button>
	{#if open}
		<ul id="{id}-options" role="listbox" class="{LIST} {side}">
			{#each options as option, index (index)}
				<li
					id="{id}-{index}"
					role="option"
					aria-selected={index === active}
					class={[OPTION, index === active && 'bg-base-200']}
					onmousedown={(event) => {
						event.preventDefault();
						choose(option);
					}}
					onmousemove={() => (active = index)}
				>
					<div class={['truncate', option.value === value && 'font-medium']}>
						{option.label ?? (option.value || placeholder)}
					</div>
					{#if option.description}
						<div class="text-xs text-base-content/50">{option.description}</div>
					{/if}
				</li>
			{/each}
		</ul>
	{/if}
</div>
