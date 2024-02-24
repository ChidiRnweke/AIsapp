<script lang="ts">
	import Button from 'flowbite-svelte/Button.svelte';
	import ArrowRight from '~icons/mdi/arrow-right';
	export let formAction: (ev: Event) => void = () => {};
	export let disabled = false;
</script>

<Button
	{disabled}
	type="submit"
	on:click={formAction}
	class=" bg-primary dark:bg-dark-primary hover:bg-accent dark:hover:bg-dark-accent self-stretch text-lg font-extrabold"
>
	<slot />
	<ArrowRight />
</Button>
