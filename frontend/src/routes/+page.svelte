<script lang="ts">
	import Heading from 'flowbite-svelte/Heading.svelte';
	import P from 'flowbite-svelte/P.svelte';
	import DeviceMockup from 'flowbite-svelte/DeviceMockup.svelte';
	import AppBenefits from '../components/Home/AppBenefits.svelte';
	import Avatar from 'flowbite-svelte/Avatar.svelte';
	import Nav from '../components/Shared/Nav.svelte';
	import Footer from '../components/Shared/Footer.svelte';
	import CTA from '../components/Shared/CTA.svelte';
</script>

<header class="grid grid-cols-1 place-items-center text-center mb-20 header-bg">
	<Heading tag="h1" class="text-primary dark:text-dark-primary pb-12 text-6xl">
		Find time for what matters.
	</Heading>
	<P align="center" class="pb-8">
		AIsapp intelligently organizes your life by prioritizing your tasks and fitting them into your
		available time. <br /> Experience the perfect balance between productivity and personal time.
	</P>
	<DeviceMockup />
	<CTA />
</header>

<main
	class="lg:mr-56 lg:ml-56 mr-5 ml-5 text-foreground dark:text-dark-foreground border-b-2 mb-2 main-bg"
>
	<section class="grid grid-cols-1 place-items-center mb-20">
		<Heading tag="h2" class="text-primary dark:text-dark-primary pb-12 text-center">
			Do more than chase deadlines.
		</Heading>
		<P
			class="text-foreground dark:text-dark-foreground  text-wrap text-center max-w-xl mb-10 leading-loose "
		>
			<span class="text-accent dark:text-dark-accent font-extrabold">"</span>
			Life is too to short move from one deadline to the next. On the other hand, it's hard to find time
			for things that matter like friends, family and hobbies. I built AIsapp to bridge this gap. A personal
			assistant that understands you and your schedule. An assistant that unlocks your capabilities.
			<span class="text-accent dark:text-dark-accent font-extrabold">"</span>
		</P>
		<div class="flex flex-row gap-5">
			<Avatar rounded border class="mb-4" />
			<div>
				<P class="text-accent dark:text-dark-accent font-extrabold">Chidi Nweke</P>
				<P class="text-subtle dark:text-dark-subtle">Creator of AIsapp</P>
			</div>
		</div>
	</section>

	<section class="mb-20">
		<Heading tag="h2" class="text-primary dark:text-dark-primary text-center font-extrabold mb-20">
			Features Designed to Empower You
		</Heading>

		<AppBenefits />
	</section>

	<section class="grid place-items-center mb-20">
		<Heading tag="h2" class="text-primary dark:text-dark-primary text-center">
			Convinced? Get started right here.
		</Heading>
		<CTA />
	</section>
</main>
