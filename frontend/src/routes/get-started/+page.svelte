<script lang="ts">
	import FormComponent from '../../components/Forms/FormComponent.svelte';
	import H1 from '../../components/Shared/H1.svelte';
	import H2 from '../../components/Shared/H2.svelte';
	import Main from '../../components/Shared/Main.svelte';
	import FormSubmit from '../../components/Forms/FormSubmit.svelte';

	import AspectSelector from '../../components/Get-started/AspectSelector.svelte';
	import MilestoneSelector from '../../components/Get-started/MilestoneSelector.svelte';
	import { aspectsStore } from '$lib/Get-started/stores';
	import { onDestroy } from 'svelte';

	let aspectError = false;
	let currentScreen: 'aspect' | 'milestone' | 'task' = 'aspect';
	let backDisabled = true;
	let forwardDisabled = false;
	let selected: string[];

	const unsubscribe = aspectsStore.subscribe((aspects) => (selected = aspects));

	const goForward = (ev: Event) => {
		ev.preventDefault;
		switch (currentScreen) {
			case 'aspect':
				if (selected.length > 0) {
					currentScreen = 'milestone';
					backDisabled = false;
					aspectError = false;
				} else {
					aspectError = true;
				}
				break;
			case 'milestone':
				currentScreen = 'task';
				forwardDisabled = true;
				break;
			case 'task':
				currentScreen = 'task';
				break;
		}
	};

	const goBack = (ev: Event) => {
		ev.preventDefault;

		switch (currentScreen) {
			case 'aspect':
				currentScreen = 'aspect';
				break;
			case 'milestone':
				currentScreen = 'aspect';
				backDisabled = true;
				break;
			case 'task':
				currentScreen = 'milestone';
				forwardDisabled = false;
				break;
		}
	};
	onDestroy(unsubscribe);
</script>

<header class="header-bg mb-20 grid grid-cols-1 place-items-center text-center">
	<H1 text="Welcome! Let's get you started." />
</header>

<Main>
	<section>
		<FormComponent formSize="lg">
			{#if currentScreen == 'aspect'}
				<AspectSelector error={aspectError} />
			{/if}
			{#if currentScreen == 'milestone'}
				<MilestoneSelector />
			{/if}
			{#if currentScreen == 'task'}
				<H2 title="Tasks - step 3/3" alignment="center" marginBottom="20" />
			{/if}
			<div class="flex flex-row gap-4">
				<FormSubmit disabled={backDisabled} formAction={goBack} arrowDirection="left">
					Back
				</FormSubmit>
				<FormSubmit disabled={forwardDisabled} formAction={goForward}>Next</FormSubmit>
			</div>
		</FormComponent>
	</section>
</Main>
