<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import '../app.css';
	import { firebaseClient } from '$lib/Firebase/firebase.svelte';
	
	let { children, data } = $props();
	const client = firebaseClient();
	
	client.serverInit(data.preload);
	setContext('client', client);
	$inspect(client.user);
	
	onMount(() => {
		client.clientInit(() => {});
	});
</script>

{@render children()}

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
			Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
		background-color: #f8f9fa;
	}

	:global(*) {
		box-sizing: border-box;
	}
</style>

