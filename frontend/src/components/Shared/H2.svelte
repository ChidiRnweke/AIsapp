<script>
	import Heading from 'flowbite-svelte/Heading.svelte';
	export let title = '';
</script>

<Heading tag="h2" class="text-primary dark:text-dark-primary mb-20 text-center font-extrabold">
	{title}
</Heading>
