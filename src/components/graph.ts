import type { Observable } from "rxjs";
import { FuegoElement } from "./fuego-element";
import { registerFuegoElement } from "./fuego-element";

export interface IFuegoGraphElementProps {
  data$: Observable<number[]>;
  height: number;
  width: number;
}

export class FuegoGraphElement extends FuegoElement<IFuegoGraphElementProps> {
  protected override connectedCallbackWithProps({
    data$,
    height,
    width,
  }: IFuegoGraphElementProps): Node {
    const canvas = document.createElement("canvas");
    canvas.height = height;
    canvas.width = width;

    const ctx = canvas.getContext("2d")!;
    const subscription = data$.subscribe((values) => {
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

    this.onCleanup(() => subscription.unsubscribe());
    return canvas;
  }
}

export const createFuegoGraphElement = registerFuegoElement<
  FuegoGraphElement,
  IFuegoGraphElementProps
>("fuego-graph", FuegoGraphElement);
