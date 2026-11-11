<script lang="ts">
	import { SvelteSet } from 'svelte/reactivity';
	import { FolderTree, SidePane, buildTree } from '../../lib/index.js';

	const paths = ['shop/orders', 'shop/refunds', 'reports/daily/export', 'reports/weekly', 'intake'];
	const tree = buildTree(paths, (path) => path);

	let open = $state(true);
	let folder = $state<string | null>(null);
	const expanded = new SvelteSet<string>();
</script>

<section class="relative flex h-[calc(100vh-4rem)]">
	<SidePane
		{open}
		title="Folders"
		collapseLabel="Collapse folders"
		expandLabel="Expand folders"
		ontoggle={() => (open = !open)}
		onclose={() => (open = false)}
	>
		<div class="min-h-0 flex-1 overflow-y-auto px-3 pb-3">
			<FolderTree
				{tree}
				selected={folder}
				{expanded}
				allLabel="All items"
				allIcon="tabler:layout-list"
				allCount={paths.length}
				expandLabel={(f) => `Expand ${f}`}
				collapseLabel={(f) => `Collapse ${f}`}
				onselect={(f) => (folder = f)}
				ontoggle={(f) => (expanded.has(f) ? expanded.delete(f) : expanded.add(f))}
			/>
		</div>
	</SidePane>
	<div class="flex-1 px-6 pt-6 text-[0.9375rem] font-semibold">{folder ?? 'All items'}</div>
</section>
