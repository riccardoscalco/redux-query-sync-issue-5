<buttons-bar>
	<button aria-label="1" class="button-one {selected: oneOnFocus}" onclick={setFocusOne}>1</button>
	<button aria-label="2" class="button-two {selected: twoOnFocus}" onclick={setFocusTwo}>2</button>
	<button aria-label="3" class="button-three {selected: threeOnFocus}" onclick={setFocusThree}>3</button>

	<style>
		.selected {
			border: 2px solid red;
		}
	</style>

	<script>
		import buttonsTag from './buttons-bar.js';
		buttonsTag.call(this, opts);
	</script>
</buttons-bar>