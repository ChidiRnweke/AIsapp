<script lang="ts">
	import Button from 'flowbite-svelte/Button.svelte';
	import ArrowRight from '~icons/mdi/arrow-right';
</script>

<Button
	type="submit"
	class=" bg-primary dark:bg-dark-primary hover:bg-accent dark:hover:bg-dark-accent self-stretch text-lg font-extrabold"
>
	<slot />
	<ArrowRight />
</Button>
