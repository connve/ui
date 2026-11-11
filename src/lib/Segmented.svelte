<script lang="ts" generics="T extends string">
	interface Props {
		/** Names the group for assistive tech. */
		label: string;
		options: { id: T; label: string }[];
		value: T;
		onchange?: (value: T) => void;
	}

	let { label, options, value = $bindable(), onchange }: Props = $props();

	function select(id: T) {
		value = id;
		onchange?.(id);
	}
</script>

<div
	class="flex items-center gap-0.5 rounded-full border border-base-300 bg-base-200/50 p-0.5 text-xs"
	role="group"
	aria-label={label}
>
	{#each options as option (option.id)}
		<button
			type="button"
			class={[
				'h-6 rounded-full px-3 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary',
				value === option.id
					? 'bg-base-100 font-medium shadow-sm'
					: 'text-base-content/60 hover:text-base-content'
			]}
			aria-pressed={value === option.id}
			onclick={() => select(option.id)}
		>
			{option.label}
		</button>
	{/each}
</div>
