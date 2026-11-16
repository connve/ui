<script lang="ts">
	import { onMount } from 'svelte';
	import { theme } from '../lib/index.js';
	import '../app.css';

	let { children } = $props();

	onMount(() => theme.start());
</script>

{@render children()}
