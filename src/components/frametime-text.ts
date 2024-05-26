import { bufferTime, distinctUntilChanged, map } from "rxjs";
import { frametime$ } from "../rx/observables/frametime";
import { append } from "../utils/append";
import { defineComponent } from "./define-component";

const frametimePerSecond$ = frametime$.pipe(bufferTime(1000));

const createAvgFrametimeText = defineComponent(
	"avg-frametime",
	({ onCleanup }) => {
		const el = document.createElement("span");

		const frametimeAvgPerSecond$ = frametimePerSecond$.pipe(
			map((arr) =>
				(arr.reduce((acc, cur) => acc + cur, 0) / (arr.length || 1)).toFixed(1),
			),
			distinctUntilChanged(),
		);

		const avgSubscription = frametimeAvgPerSecond$.subscribe((avgFrametime) => {
			el.innerHTML = `Frametime: <sub>avg</sub>${avgFrametime}`;
		});

		onCleanup(() => avgSubscription.unsubscribe());

		return el;
	},
);

const createMaxFrametimeText = defineComponent(
	"max-frametime",
	({ onCleanup }) => {
		const el = document.createElement("span");

		const frametimeMaxPerSecond$ = frametimePerSecond$.pipe(
			map((arr) => arr.reduce((acc, cur) => Math.max(acc, cur), 0).toFixed(1)),
			distinctUntilChanged(),
		);

		const maxSubscription = frametimeMaxPerSecond$.subscribe((maxFrametime) => {
			el.innerHTML = `<sub>max</sub>${maxFrametime} ms`;
		});

		onCleanup(() => maxSubscription.unsubscribe());

		return el;
	},
);

export function createFrametimeTextElement() {
	return append(document.createElement("div"), [
		createAvgFrametimeText(),
		document.createTextNode(" / "),
		createMaxFrametimeText(),
	]);
}
