<script lang="ts">
	import Heading from 'flowbite-svelte/Heading.svelte';
	import P from 'flowbite-svelte/P.svelte';
	import DeviceMockup from 'flowbite-svelte/DeviceMockup.svelte';
	import AppBenefits from '../components/Home/AppBenefits.svelte';
	import Avatar from 'flowbite-svelte/Avatar.svelte';
	import CTA from '../components/Shared/CTA.svelte';
	import Main from '../components/Shared/Main.svelte';
	import H2 from '../components/Shared/H2.svelte';
</script>

<header class="header-bg mb-20 grid grid-cols-1 place-items-center text-center">
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

<Main>
	<section class="mb-20 grid grid-cols-1 place-items-center">
		<Heading tag="h2" class="text-primary dark:text-dark-primary pb-12 text-center">
			Do more than chase deadlines.
		</Heading>
		<P
			class="text-foreground dark:text-dark-foreground  mb-10 max-w-xl text-wrap text-center leading-loose "
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
		<H2 title="Features Designed to Empower You" />
		<AppBenefits />
	</section>

	<section class="grid place-items-center">
		<H2 title="Convinced? Get started right here." />
		<CTA />
	</section>
</Main>
