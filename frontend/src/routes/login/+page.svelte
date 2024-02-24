<script lang="ts">
	import H1 from '../../components/Shared/H1.svelte';
	import P from 'flowbite-svelte/P.svelte';
	import Main from '../../components/Shared/Main.svelte';
	import Button from 'flowbite-svelte/Button.svelte';
	import Heading from 'flowbite-svelte/Heading.svelte';
	import PasswordInput from '../../components/Register/PasswordInput.svelte';
	import EmailInput from '../../components/Register/EmailInput.svelte';
	import FormComponent from '../../components/Register/FormComponent.svelte';
</script>

<header class="header-bg mb-20 grid grid-cols-1 place-items-center text-center">
	<H1 text="AIsapp" />
</header>

<Main>
	<FormComponent>
		<Heading tag="h2" class="text-primary dark:text-dark-primary pb-6 text-center">
			Log in here.
		</Heading>
		<P align="center" class="text-accent dark:text-dark-accent pb-8 font-bold">
			Pick up where you left off.
		</P>

		<div class="mb-10 self-stretch">
			<EmailInput />
		</div>
		<div class="mb-10 self-stretch">
			<PasswordInput />
		</div>
		<div class="mb-10 self-stretch text-center">
			<a href="/forgot-password" class="text-accent dark:text-dark-accent font-bold">
				Forgot your password?
			</a>
		</div>
		<Button
			type="submit"
			class=" bg-primary dark:bg-dark-primary hover:bg-accent dark:hover:bg-dark-accent self-stretch text-lg"
		>
			Log in
		</Button>
	</FormComponent>
</Main>
