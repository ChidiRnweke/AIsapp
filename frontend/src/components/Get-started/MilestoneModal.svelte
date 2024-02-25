<script lang="ts">
	import Button from 'flowbite-svelte/Button.svelte';
	import Modal from 'flowbite-svelte/Modal.svelte';
	import TextMultiSelect from './TextMultiSelect.svelte';
	import { milestoneStore } from '$lib/Get-started/stores';
	export let aspect: string;
	export let open: boolean;
	export let close: () => void;
	let selected: Array<string> = [];

	$: milestone = { name: aspect, milestones: selected };
	function updateStore() {
		milestoneStore.update((currentMilestones) => {
			const updatedMilestones = [...currentMilestones];
			const index = updatedMilestones.findIndex((m) => m.name === aspect);

			if (index !== -1) {
				updatedMilestones[index] = { ...milestone };
			} else {
				updatedMilestones.push({ ...milestone });
			}

			return updatedMilestones;
		});
		open = false;
	}
</script>

<Modal title={aspect} bind:open autoclose on:close={close}>
	<div class="mb-10 self-stretch">
		<TextMultiSelect
			textPlaceholder="Career"
			bind:selected
			labelText="Let's add some milestones."
		/>
	</div>
	<svelte:fragment slot="footer">
		<Button on:click={() => updateStore()}>Done.</Button>
	</svelte:fragment>
</Modal>
