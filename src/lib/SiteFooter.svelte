<script lang="ts" module>
	import type { IconifyIcon } from '@iconify/svelte';

	/** A round link in the footer: an icon, or an image such as a logo. */
	export interface FooterLink {
		href: string;
		/** Names the link, for screen readers. */
		label: string;
		icon?: string | IconifyIcon;
		image?: string;
	}
</script>

<script lang="ts">
	import Icon from '@iconify/svelte';
	import Badge from './Badge.svelte';
	import { brandGithubFilled, brandHelm, brandLinkedinFilled, mail } from './icons.js';

	interface Props {
		address?: string;
		registry?: string;
		copyright?: string;
		links?: FooterLink[];
		/** The width of the page the footer sits under. */
		class?: string;
	}

	let {
		address = 'ul. Złota 75A lok. 7, 00-819 Warszawa',
		registry = 'NIP 5090052574 · REGON 381354056',
		copyright = `Copyright © ${new Date().getFullYear()} CONNVE. All rights reserved.`,
		links = [
			{ href: 'mailto:hello@connve.com', label: 'Email CONNVE', icon: mail },
			{
				href: 'https://www.linkedin.com/company/connve/',
				label: 'CONNVE on LinkedIn',
				icon: brandLinkedinFilled
			},
			{ href: 'https://github.com/connve', label: 'CONNVE on GitHub', icon: brandGithubFilled },
			{ href: 'https://helm.connve.com/', label: 'CONNVE Helm repository', icon: brandHelm }
		],
		class: className = 'mx-auto max-w-[90rem] px-4 md:px-6'
	}: Props = $props();
</script>

<footer class="border-t border-base-200">
	<div class={[className, 'py-10']}>
		<div class="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
			<div class="flex flex-col gap-1 text-xs text-base-content/60">
				<div class="flex items-center gap-2">
					<span>{address}</span>
					<Badge>HQ</Badge>
				</div>
				<div>{registry}</div>
			</div>
			<div class="flex items-center gap-3">
				{#each links as link (link.href)}
					<a
						href={link.href}
						target={link.href.startsWith('mailto:') ? undefined : '_blank'}
						rel="noopener"
						aria-label={link.label}
						class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-base-300 bg-base-100 text-base-content transition hover:-translate-y-px hover:border-primary hover:text-primary"
					>
						{#if link.image}
							<img class="h-5 w-5" src={link.image} alt="" />
						{:else if link.icon}
							<Icon icon={link.icon} class="h-5 w-5" />
						{/if}
					</a>
				{/each}
			</div>
		</div>
		<div class="mt-6 border-t border-base-200 pt-4 text-xs text-base-content/60">{copyright}</div>
	</div>
</footer>
