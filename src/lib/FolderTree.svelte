<script lang="ts" generics="T">
	import Icon, { type IconifyIcon } from '@iconify/svelte';
	import * as icons from './icons.js';
	import type { Snippet } from 'svelte';
	import type { TreeNode } from './tree.js';

	interface Props {
		tree: TreeNode<T>[];
		/** The selected folder, `null` for all. */
		selected: string | null;
		expanded: ReadonlySet<string>;
		allLabel: string;
		allIcon: string | IconifyIcon;
		/** Shown after the "all" row's label. */
		allCount?: number;
		expandLabel: (folder: string) => string;
		collapseLabel: (folder: string) => string;
		onselect: (folder: string | null) => void;
		ontoggle: (folder: string) => void;
		/** Shown after a folder's name; its item count when unset. */
		trailing?: Snippet<[TreeNode<T>]>;
	}

	let {
		tree,
		selected,
		expanded,
		allLabel,
		allIcon,
		allCount,
		expandLabel,
		collapseLabel,
		onselect,
		ontoggle,
		trailing
	}: Props = $props();

	function row(isSelected: boolean) {
		return [
			'flex h-9 w-full min-w-0 items-center gap-2 rounded-md pr-2 text-left text-sm transition-colors',
			isSelected ? 'bg-base-200 font-medium' : 'hover:bg-base-200/60'
		];
	}
</script>

<ul class="space-y-px">
	<li>
		<button
			type="button"
			class={row(selected === null)}
			style="padding-left: 1.75rem"
			aria-current={selected === null ? 'true' : undefined}
			onclick={() => onselect(null)}
		>
			<Icon icon={allIcon} class="h-4 w-4 shrink-0 opacity-60" />
			<span class="min-w-0 flex-1 truncate">{allLabel}</span>
			{#if allCount !== undefined}
				<span class="shrink-0 text-xs text-base-content/60 tabular-nums">{allCount}</span>
			{/if}
		</button>
	</li>
	{#snippet folders(nodes: TreeNode<T>[])}
		{#each nodes.filter((node) => node.isFolder) as node (node.fullPath)}
			{@const isOpen = expanded.has(node.fullPath)}
			{@const canExpand = (node.children ?? []).some((child) => child.isFolder)}
			{@const indent = node.depth * 0.75}
			<li>
				<div class="relative">
					<button
						type="button"
						class={row(selected === node.fullPath)}
						style="padding-left: {indent + 1.75}rem"
						aria-current={selected === node.fullPath ? 'true' : undefined}
						onclick={() => onselect(node.fullPath)}
					>
						<Icon
							icon={isOpen && canExpand ? icons.folderOpen : icons.folder}
							class="h-4 w-4 shrink-0 opacity-60"
						/>
						<span class="min-w-0 flex-1 truncate">{node.name}</span>
						{#if trailing}
							{@render trailing(node)}
						{:else if node.fileCount !== undefined}
							<span class="shrink-0 text-xs text-base-content/60 tabular-nums"
								>{node.fileCount}</span
							>
						{/if}
					</button>
					{#if canExpand}
						<button
							type="button"
							class="absolute top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded text-base-content/60 hover:bg-base-300/50 hover:text-base-content"
							style="left: {indent + 0.25}rem"
							aria-label={isOpen ? collapseLabel(node.name) : expandLabel(node.name)}
							aria-expanded={isOpen}
							onclick={() => ontoggle(node.fullPath)}
						>
							<Icon
								icon={icons.chevronRight}
								class="h-3.5 w-3.5 transition-transform motion-reduce:transition-none {isOpen
									? 'rotate-90'
									: ''}"
							/>
						</button>
					{/if}
				</div>
				{#if isOpen && canExpand && node.children}
					<ul class="space-y-px">
						{@render folders(node.children)}
					</ul>
				{/if}
			</li>
		{/each}
	{/snippet}
	{@render folders(tree)}
</ul>
