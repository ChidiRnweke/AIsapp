<script lang="ts">
	import Helper from 'flowbite-svelte/Helper.svelte';
	import H2 from '../Shared/H2.svelte';
	import Paragraph from '../Shared/Paragraph.svelte';
	import TextMultiSelect from './TextMultiSelect.svelte';
	import { aspectsStore } from '$lib/Get-started/stores';
	const defaultItems = [
		{
			value: 'Career',
			name: 'Career'
		},
		{
			value: 'Family',
			name: 'Family'
		},
		{
			value: 'Sports',
			name: 'Sports'
		},
		{
			value: 'Reading',
			name: 'Reading'
		},
		{
			value: 'Education',
			name: 'Education'
		},
		{
			value: 'Health',
			name: 'Health'
		}
	];
	export let error = false;
</script>

<H2 title="Aspects - step 1/3" alignment="center" marginBottom="10" />
<Paragraph textType="regular" class="mb-8 font-extrabold">
	Aspects are the pillars of your life – areas where you want to invest your time and energy. They
	can be anything from 'Health' to 'Learning' or 'Career'.
</Paragraph>
<div class="mb-10 self-stretch">
	<TextMultiSelect
		textPlaceholder="Career"
		items={defaultItems}
		bind:selected={$aspectsStore}
		labelText="Let's get you started with some aspects."
	/>
	{#if error}
		<Helper class="text-error dark:text-dark-error mt-2 text-lg">
			<span class="font-medium"> Sorry!</span>
			You have to select at least one aspect to proceed.
		</Helper>
	{/if}
</div>
