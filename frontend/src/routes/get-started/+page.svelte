<script lang="ts">
	import TextMultiSelect from '../../components/Get-started/TextMultiSelect.svelte';
	import FormComponent from '../../components/Register/FormComponent.svelte';
	import H1 from '../../components/Shared/H1.svelte';
	import H2 from '../../components/Shared/H2.svelte';
	import Main from '../../components/Shared/Main.svelte';
	import Paragraph from '../../components/Shared/Paragraph.svelte';
	import FormSubmit from '../../components/Register/FormSubmit.svelte';
	const defaultItems = [
		{
			value: 'career',
			name: 'career'
		},
		{
			value: 'family',
			name: 'family'
		},
		{
			value: 'sports',
			name: 'sports'
		},
		{
			value: 'reading',
			name: 'reading'
		},
		{
			value: 'education',
			name: 'education'
		},
		{
			value: 'health',
			name: 'health'
		}
	];
	let selected: Array<string>;
</script>

<header class="header-bg mb-20 grid grid-cols-1 place-items-center text-center">
	<H1 text="Welcome! Let's get you started." />
</header>

<Main>
	<section>
		<FormComponent formSize="lg">
			<H2 title="Aspects - step 1/3" alignment="center" marginBottom="20" />
			<Paragraph textType="accent" class="mb-8 font-extrabold">
				Aspects are the pillars of your life – areas where you want to invest your time and energy.
				They can be anything from 'Health' to 'Learning' or 'Career'.
			</Paragraph>
			<div class="mb-10 self-stretch">
				<TextMultiSelect
					textPlaceholder="Career"
					items={defaultItems}
					bind:selected
					labelText="Let's get you started with some aspects."
				/>
			</div>
			<FormSubmit>Ready</FormSubmit>
		</FormComponent>
	</section>
</Main>
