<script lang="ts">
	import { labels } from './labels.svelte.js';
	import type { PaneSize } from './paneSize.svelte.js';

	let { pane }: { pane: PaneSize } = $props();

	const EDGE = {
		left: 'inset-y-0 -left-1.5 w-3 cursor-col-resize justify-center',
		right: 'inset-y-0 -right-1.5 w-3 cursor-col-resize justify-center',
		top: 'inset-x-0 -top-1.5 h-3 cursor-row-resize items-center'
	};
</script>

<!-- Drag the pane's inner edge, or use the arrow keys, to resize it; Home or a
     double-click restores the default. The hit area is wider than the line.
     A focusable separator, as in the WAI-ARIA window splitter pattern. -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex, a11y_no_noninteractive_element_interactions (a focusable separator is a widget in WAI-ARIA) -->
<div
	role="separator"
	tabindex="0"
	aria-label={labels.resize}
	aria-orientation={pane.vertical ? 'horizontal' : 'vertical'}
	aria-valuenow={pane.size}
	aria-valuemin={pane.min}
	aria-valuemax={pane.max}
	class="group absolute z-10 flex touch-none focus-visible:outline-none {EDGE[pane.edge]}"
	onpointerdown={pane.start}
	ondblclick={pane.reset}
	onkeydown={pane.keydown}
>
	<span
		class="transition-colors group-hover:bg-primary/60 group-focus-visible:bg-primary {pane.vertical
			? 'h-px w-full'
			: 'h-full w-px'} {pane.dragging ? 'bg-primary' : ''}"
	></span>
</div>
