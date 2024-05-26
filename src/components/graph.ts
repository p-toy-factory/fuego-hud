import type { Observable } from "rxjs";
import { defineComponent } from "./define-component";

export interface IFuegoGraphElementProps {
	data$: Observable<number[]>;
	height: number;
	width: number;
}

export const createFuegoGraphElement = defineComponent<IFuegoGraphElementProps>(
	"reactive-element",
	({ props: { data$, height, width }, onCleanup }) => {
		const canvas = document.createElement("canvas");
		canvas.height = height;
		canvas.width = width;

		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		const ctx = canvas.getContext("2d")!;

		const subscription = data$.subscribe((values: number[]) => {
			ctx.clearRect(0, 0, width, height);
			ctx.beginPath();
			ctx.moveTo(0, height - values[0]);
			for (let i = 1, len = values.length; i < len; i++) {
				const x = i;
				const y = Math.max(0, height - values[i]);
				ctx.lineTo(x, y);
			}
			ctx.stroke();
		});

		onCleanup(() => subscription.unsubscribe());

		return canvas;
	},
);
