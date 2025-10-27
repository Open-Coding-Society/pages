---
layout: opencs
title: Mansion Game — Level 4
permalink: /gamify/mansion4
---

<div id="gameContainer">
	<div id="promptDropDown" class="promptDropDown" style="z-index: 9999"></div>
	<canvas id='gameCanvas'></canvas>
</div>

<script type="module">
	// Mansion Game Level 4 page: mirrors mainworld.md but loads only Level 4
	import Game from "{{site.baseurl}}/assets/js/mansionGame/GameEngine/Game.js";
	import GameLevel4 from "{{site.baseurl}}/assets/js/mansionGame/mansionLevel4.js";
	import { pythonURI, javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';

	const gameLevelClasses = [GameLevel4];

	// Web Server Environment data
	const environment = {
		path: "{{site.baseurl}}",
		pythonURI: pythonURI,
		javaURI: javaURI,
		fetchOptions: fetchOptions,
		gameContainer: document.getElementById("gameContainer"),
		gameCanvas: document.getElementById("gameCanvas"),
		gameLevelClasses: gameLevelClasses,
		// Optional global background similar to mainworld
		globalBackgroundData: {
			src: "{{site.baseurl}}/images/mansionGame/mansion_outside_photo.png",
			mode: 'cover',
			crossOrigin: 'anonymous'
		}
	};

	// Launch Mansion Game with Level 4
	Game.main(environment);
</script>