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

	$: sectionClass = ` ${size} grid-cols-1 flex-col place-items-center rounded-md p-${padding} shadow-md border-t-secondary dark:border-t-dark-secondary border-t-4`;
</script>

<form class="grid grid-cols-1 place-items-center">
	<section class={sectionClass}>
		<slot />
	</section>
</form>
