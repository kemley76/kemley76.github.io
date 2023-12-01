<script lang="ts">
	export let math: string;
	export let displayMode = false;
    import katex from 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.mjs';
	
	const options = {
		displayMode: displayMode,
		throwOnError: false
	}
	
	$: katexString = katex.renderToString(math, options);
</script>

<svelte:head>
<script nomodule defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.js" integrity="sha384-ImWHyYvDPlRzwFnvLhG9Jcpm/7qL4SVIuJK0C6Rj+Mf7fpeNJCLCynC+EVz4kCSA" crossorigin="anonymous"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.css" integrity="sha384-OH8qNTHoMMVNVcKdKewlipV4SErXqccxxlg6HC9Cwjr5oZu2AdBej1TndeCirael" crossorigin="anonymous">
</svelte:head>

{@html katexString}