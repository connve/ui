<script lang="ts">
	import { labels } from './labels.svelte.js';

	interface Props {
		/** Called with a checked address once the viewer has consented; the app records the signup. */
		onsubscribe: (email: string) => void;
		/** The width of the page the section sits in. */
		class?: string;
	}

	let { onsubscribe, class: className = 'mx-auto max-w-[90rem] px-4 md:px-6' }: Props = $props();

	const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

	let email = $state('');
	let consent = $state(false);
	let submitted = $state(false);
	let error = $state<string | null>(null);
	const errorId = $props.id();

	// Typing an address ticks the consent box; the viewer can still untick it.
	function oninput() {
		consent = email.trim().length > 0;
	}

	function onsubmit(event: SubmitEvent) {
		event.preventDefault();
		const address = email.trim();
		if (!address || !EMAIL_RE.test(address)) {
			error = labels.newsletterInvalidEmail;
			return;
		}
		if (!consent) {
			error = labels.newsletterConsentRequired;
			return;
		}
		error = null;
		onsubscribe(address);
		submitted = true;
	}
</script>

<!-- An inverted band: everything inside, the field too, takes the neutral colors, which read on it in both themes. -->
<section class="bg-neutral text-neutral-content">
	<div
		class={[className, 'flex flex-col gap-4 py-10 lg:flex-row lg:items-start lg:justify-between']}
	>
		<div>
			<h3 class="text-base font-semibold">{labels.newsletterTitle}</h3>
			<p class="mt-1 text-sm opacity-60">{labels.newsletterSubtitle}</p>
		</div>
		{#if submitted}
			<p class="text-sm font-medium">{labels.newsletterDone}</p>
		{:else}
			<form {onsubmit} class="flex w-full max-w-xl flex-col gap-2 lg:w-auto">
				<div class="flex items-start gap-2">
					<input
						type="email"
						bind:value={email}
						{oninput}
						placeholder={labels.newsletterPlaceholder}
						aria-label={labels.newsletterEmail}
						required
						aria-invalid={error === labels.newsletterInvalidEmail || undefined}
						aria-describedby={error ? errorId : undefined}
						class="input min-w-0 flex-1 border border-neutral-content/30 bg-neutral-content/10 text-neutral-content input-sm outline-none placeholder:text-neutral-content/60 autofill:shadow-[inset_0_0_0_1000px_var(--color-neutral)] autofill:[-webkit-text-fill-color:var(--color-neutral-content)] focus:border-primary lg:w-80"
					/>
					<button type="submit" class="btn btn-primary btn-sm">{labels.newsletterSubscribe}</button>
				</div>
				<label class="flex cursor-pointer items-start gap-2 text-xs lg:max-w-md">
					<input
						type="checkbox"
						bind:checked={consent}
						class="checkbox mt-0.5 checkbox-xs checkbox-primary"
					/>
					<span class="leading-relaxed opacity-60">{labels.newsletterConsent}</span>
				</label>
				{#if error}
					<p id={errorId} class="text-xs font-medium" role="alert">{error}</p>
				{/if}
			</form>
		{/if}
	</div>
</section>
