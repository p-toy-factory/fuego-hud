import { createFuegoGraphElement } from "./components/graph";
import { fps$ } from "./rx/observables/fps";
import { frametime$ } from "./rx/observables/frametime";
import { keepLast } from "./rx/operators/keep-last";
import { createFpsTextElement } from "./components/fps-text";
import { createFrametimeTextElement } from "./components/frametime-text";
import { append } from "./utils/append";

export function runFuegoHud() {
	const container = document.createElement("div");
	container.id = "fuego-hud";
	container.setAttribute(
		"style",
		[
			"position: fixed",
			"top: 0",
			"left: 0",
			"background: #ffffff7f",
			"pointer-events: none",
			"z-index: 114514",
		].join("; "),
	);

	const graphWidth = 60 * 3;
	const seed = new Array(graphWidth).fill(0);

	const fpss$ = fps$.pipe(keepLast(graphWidth, seed));
	const fpsGraph = createFuegoGraphElement({
		data$: fpss$,
		height: 60,
		width: graphWidth,
	});

	const frametimes$ = frametime$.pipe(keepLast(graphWidth, seed));
	const frametimeGraph = createFuegoGraphElement({
		data$: frametimes$,
		height: 50,
		width: graphWidth,
	});

	const fpsTextEl = createFpsTextElement();
	const frametimeTextEl = createFrametimeTextElement();

	append(document.body, [
		append(container, [fpsTextEl, fpsGraph, frametimeTextEl, frametimeGraph]),
	]);

	return function closeFuegoHud() {
		container.remove();
	};
}

runFuegoHud();
