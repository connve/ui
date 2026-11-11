<script lang="ts" module>
	export interface NavLink {
		href: string;
		label: string;
		active: boolean;
	}

	export interface NavGroup {
		title: string;
		/** An image URL shown before the title, such as a product icon. */
		icon?: string;
		links: NavLink[];
		/** Groups nested under this one, indented. */
		groups?: NavGroup[];
	}
</script>

<script lang="ts">
	import Self from './NavList.svelte';

	interface Props {
		/** Each group's `title` and each link's `href` must be unique within its list. */
		groups: NavGroup[];
		/** Called when a link is followed, e.g. to close a drawer on a phone. */
		onnavigate?: () => void;
		/** Set by the list itself for `groups` within a group. */
		nested?: boolean;
	}

	let { groups, onnavigate, nested = false }: Props = $props();
</script>

<div class={nested ? 'mt-1 space-y-2 pl-3' : 'space-y-5'}>
	{#each groups as group (group.title)}
		<section>
			<svelte:element
				this={nested ? 'h3' : 'h2'}
				class={[
					'mb-1 flex items-center gap-1.5 px-2 tracking-wider uppercase',
					nested
						? 'text-[10px] font-medium text-base-content/60'
						: 'text-xs font-semibold text-base-content/60'
				]}
			>
				{#if group.icon}
					<img src={group.icon} alt="" class="h-4 w-4" />
				{/if}
				{group.title}
			</svelte:element>
			<ul class="space-y-0.5">
				{#each group.links as link (link.href)}
					<li>
						<a
							href={link.href}
							aria-current={link.active ? 'page' : undefined}
							class={[
								'block truncate rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-base-200',
								link.active
									? 'bg-base-200 font-medium text-base-content'
									: 'text-base-content/70 hover:text-base-content'
							]}
							onclick={onnavigate}
						>
							{link.label}
						</a>
					</li>
				{/each}
			</ul>
			{#if group.groups && group.groups.length > 0}
				<Self groups={group.groups} {onnavigate} nested />
			{/if}
		</section>
	{/each}
</div>
