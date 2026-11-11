<script lang="ts">
	// Renders `children` with contexts from elsewhere in the tree: content a component
	// hands to the shell renders in the shell, and would otherwise lose the page's contexts.
	import { setContext, type Snippet } from 'svelte';

	interface Props {
		contexts: Map<unknown, unknown>;
		children: Snippet;
	}

	let { contexts, children }: Props = $props();

	// Contexts can only be set while the component starts, so the first `contexts` is the one used.
	// svelte-ignore state_referenced_locally
	for (const [key, value] of contexts) setContext(key, value);
</script>

{@render children()}
