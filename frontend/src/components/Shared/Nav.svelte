<script lang="ts">
	import { page } from '$app/stores';
	import Navbar from 'flowbite-svelte/Navbar.svelte';
	import NavBrand from 'flowbite-svelte/NavBrand.svelte';
	import NavLi from 'flowbite-svelte/NavLi.svelte';
	import NavUl from 'flowbite-svelte/NavUl.svelte';
	import NavHamburger from 'flowbite-svelte/NavHamburger.svelte';
	import DarkMode from 'flowbite-svelte/DarkMode.svelte';

	let activeClass = 'text-primary dark:text-dark-primary font-bold';
	let classProp = '';
	export { classProp as class };
	$: activeUrl = $page.url.pathname;
</script>

<Navbar class={classProp}>
	<NavBrand href="/">
		<span class="text-primary dark:text-dark-primary font-extrabold">AIsapp</span>
		<DarkMode size="lg" />
	</NavBrand>
	<NavHamburger />
	<NavUl {activeUrl} {activeClass}>
		<NavLi href="/">Home</NavLi>
		<NavLi href="/register">Register</NavLi>
		<NavLi href="/login">Login</NavLi>
	</NavUl>
</Navbar>
