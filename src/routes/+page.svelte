<script lang="ts">
	import {
		Badge,
		CopyButton,
		IconButton,
		Inspector,
		InspectorSection,
		ListHeader,
		StateMessage,
		StatusDot
	} from '../lib/index.js';

	interface Row {
		name: string;
		path: string;
		status: 'success' | 'neutral' | 'warning' | 'error';
		label: string;
	}

	const rows: Row[] = [
		{ name: 'Orders sync', path: 'shop/orders_sync', status: 'success', label: 'OK' },
		{ name: 'Nightly export', path: 'reports/nightly_export', status: 'neutral', label: 'Idle' },
		{ name: 'Webhook intake', path: 'intake/webhook', status: 'warning', label: 'Warn' },
		{ name: 'Mail sender', path: 'mail/sender', status: 'error', label: 'Error' }
	];

	let folder = $state<string | null>(null);
	let selected = $state<Row | null>(null);
</script>

<div class="flex h-[calc(100vh-4rem)] min-w-0">
	<div class="@container flex min-w-0 flex-1 flex-col overflow-y-auto">
		<div class="space-y-3 px-6 pt-6 pb-4">
			<ListHeader
				allLabel="All items"
				{folder}
				onselect={(f) => (folder = f)}
				count="{rows.length} items"
				pending={0}
				pendingLabel="0 pending changes"
				pendingHref="#"
				newHref="#"
			/>
			<div class="flex flex-wrap items-center gap-1">
				<span class="chip chip-neutral">Idle</span>
				<span class="chip chip-success">OK</span>
				<span class="chip chip-warn">Warn</span>
				<span class="chip chip-error">Error</span>
				<Badge>0.1.0</Badge>
			</div>
		</div>
		<div class="px-6">
			<table class="table w-full table-sm">
				<thead class="text-xs font-medium text-base-content/50">
					<tr><th>Name</th><th>Status</th></tr>
				</thead>
				<tbody>
					{#each rows as row (row.path)}
						<tr
							class="cursor-pointer transition-colors hover:bg-base-200 {selected === row
								? 'bg-base-200'
								: ''}"
							onclick={() => (selected = row)}
							onkeydown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') selected = row;
							}}
							tabindex="0"
							role="button"
						>
							<td class="w-full max-w-0">
								<div class="truncate font-medium">{row.name}</div>
								<div class="truncate text-xs text-base-content/50">{row.path}</div>
							</td>
							<td><StatusDot variant={row.status} label={row.label} /></td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
		<div class="min-h-80 px-6">
			<StateMessage tone="notice" message="An empty list shows this." />
		</div>
	</div>

	{#if selected}
		{@const row = selected}
		<Inspector title={row.name} label="Item details" onclose={() => (selected = null)}>
			{#snippet subtitle()}
				<StatusDot variant={row.status} label={row.label} />
			{/snippet}
			{#snippet actions()}
				<CopyButton text={row.path} tooltip="bottom" />
				<IconButton icon="tabler:arrow-up-right" label="Open full page" href="#" />
			{/snippet}
			<dl class="grid grid-cols-[max-content_minmax(0,1fr)] gap-x-4 gap-y-1">
				<dt class="text-base-content/50">Path</dt>
				<dd>{row.path}</dd>
			</dl>
			<InspectorSection title="Section">
				<p>Inspector content scrolls under its header.</p>
			</InspectorSection>
		</Inspector>
	{/if}
</div>
