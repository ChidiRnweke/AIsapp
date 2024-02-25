<script lang="ts">
	import AddButton from '../Forms/AddButton.svelte';
	import H2 from '../Shared/H2.svelte';
	import Paragraph from '../Shared/Paragraph.svelte';

	import MilestoneModal from './MilestoneModal.svelte';
	import { aspectsStore } from '$lib/Get-started/stores';
	import { onDestroy } from 'svelte';
	let selected: Array<string>;
	let modalState: Map<string, boolean> = new Map();

	const unsubscribe = aspectsStore.subscribe((aspects) => {
		selected = aspects;
		selected.forEach((aspect) => modalState.set(aspect, false));
	});

	const toggleModal = (aspect: string, state: boolean) => {
		modalState.set(aspect, state);
		modalState = new Map(modalState);
		console.log(modalState);
	};
	onDestroy(unsubscribe);
</script>

<H2 title="Milestones - step 2/3" alignment="center" marginBottom="20" />
<Paragraph textType="regular" class="mb-8 font-extrabold">
	Now that you've selected your aspects the next step is selecting your milestones. These are medium
	to longer term tangible achievements you want to make.
</Paragraph>
<div class="mb-10 flex w-full flex-col place-items-baseline gap-6 text-center">
	{#each selected as aspect}
		<div class=" flex w-full justify-between gap-10 rounded-sm">
			<p class="flex-grow text-3xl">{aspect}</p>
			<AddButton action={() => toggleModal(aspect, true)} />
		</div>
		<MilestoneModal
			{aspect}
			open={modalState.get(aspect) === true}
			close={() => toggleModal(aspect, false)}
		/>
	{/each}
</div>
