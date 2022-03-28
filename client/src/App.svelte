<script lang="ts">
	import { tick } from "svelte";

	import logo from "./assets/svelte.png";
	import Controls from "./lib/Controls.svelte";

	import { startPhaserGame } from "./game/index";

	async function loadGame() {
		await tick();

		startPhaserGame();
		console.log("Game Created");
	}
	loadGame();
</script>

<main>
	<div id="gameCanvasProd" />

	<img class="Logo" src={logo} alt="Svelte Logo" />

	<Controls />
</main>

<style type="text/scss">
	@import "./App.scss";

	:root {
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
			Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
	}

	main {
		text-align: center;
		padding: 1em;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4rem;
		font-weight: 100;
		line-height: 1.1;
		margin: 2rem auto;
		max-width: 14rem;
	}

	p {
		max-width: 14rem;
		margin: 1rem auto;
		line-height: 1.35;
	}

	@media (min-width: 480px) {
		h1 {
			max-width: none;
		}

		p {
			max-width: none;
		}
	}
</style>
