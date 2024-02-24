<script>
	import Heading from 'flowbite-svelte/Heading.svelte';
	export let text = '';
</script>

<Heading tag="h1" class="text-primary dark:text-dark-primary text-6xl">
	{text}
</Heading>
