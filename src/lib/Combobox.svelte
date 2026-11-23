<script lang="ts">
	import { FIELD, LIST, OPTION, placement } from './dropdown.js';

	interface Props {
		value: string;
		options: string[];
		label: string;
		placeholder?: string;
		onchange: (value: string) => void;
	}

	let { value, options, label, placeholder, onchange }: Props = $props();

	const id = $props.id();
	let text = $derived(value);
	let open = $state(false);
	let active = $state(-1);
	let side = $state('');
	let root = $state<HTMLDivElement | null>(null);

	let matches = $derived.by(() => {
		const needle = text.trim().toLowerCase();
		return needle && needle !== value.toLowerCase()
			? options.filter((option) => option.toLowerCase().includes(needle))
			: options;
	});

	function show() {
		side = placement(root);
		open = true;
	}

	function choose(option: string) {
		text = option;
		open = false;
		if (option !== value) onchange(option);
	}

	function commit() {
		open = false;
		if (text.trim() !== value) onchange(text.trim());
	}

	function onkeydown(event: KeyboardEvent) {
		if (event.isComposing) return;
		switch (event.key) {
			case 'ArrowDown':
			case 'ArrowUp': {
				event.preventDefault();
				if (!open) return show();
				if (matches.length === 0) return;
				const step = event.key === 'ArrowDown' ? 1 : -1;
				active =
					active < 0
						? step > 0
							? 0
							: matches.length - 1
						: (active + step + matches.length) % matches.length;
				document.getElementById(`${id}-${active}`)?.scrollIntoView({ block: 'nearest' });
				break;
			}
			case 'Enter':
				event.preventDefault();
				if (open && matches[active] !== undefined) choose(matches[active]);
				else commit();
				break;
			case 'Escape':
				if (!open) return;
				event.stopPropagation();
				text = value;
				open = false;
				break;
		}
	}
</script>

<div class="relative" bind:this={root}>
	<label class={FIELD}>
		<input
			type="text"
			class="grow"
			role="combobox"
			aria-label={label}
			aria-autocomplete="list"
			aria-expanded={open}
			aria-controls={open ? `${id}-options` : undefined}
			aria-activedescendant={open && active >= 0 ? `${id}-${active}` : undefined}
			autocomplete="off"
			spellcheck="false"
			{placeholder}
			bind:value={text}
			onfocus={show}
			oninput={() => {
				show();
				active = -1;
			}}
			onblur={commit}
			{onkeydown}
		/>
	</label>
	{#if open && matches.length > 0}
		<ul id="{id}-options" role="listbox" class="{LIST} {side}">
			{#each matches as option, index (index)}
				<li
					id="{id}-{index}"
					role="option"
					aria-selected={index === active}
					class={[
						OPTION,
						'truncate',
						index === active && 'bg-base-200',
						option === value && 'font-medium'
					]}
					onmousedown={(event) => {
						event.preventDefault();
						choose(option);
					}}
					onmousemove={() => (active = index)}
				>
					{option}
				</li>
			{/each}
		</ul>
	{/if}
</div>
