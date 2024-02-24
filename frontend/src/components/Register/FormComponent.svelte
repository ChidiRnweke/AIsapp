<script lang="ts">
	export let padding = '16';
	export let formSize: 'sm' | 'md' | 'lg' = 'lg';

	$: size = (() => {
		switch (formSize) {
			case 'sm':
				return '';
			case 'md':
				return 'flex w-full max-w-md';
			case 'lg':
				return 'flex w-full max-w-xl';
			default:
				return '';
		}
	})();

	$: sectionClass = `dark:bg-dark-background-alt bg-background-alt ${size} grid-cols-1 flex-col place-items-center rounded-md bg-opacity-30 p-${padding} shadow-sm dark:bg-opacity-50`;
</script>

<form class="grid grid-cols-1 place-items-center">
	<section class={sectionClass}>
		<slot />
	</section>
</form>
