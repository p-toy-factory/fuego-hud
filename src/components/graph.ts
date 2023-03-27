import { Observable } from "rxjs";

export function graph({
  data$,
  height,
  width,
}: {
  data$: Observable<number[]>;
  height: number;
  width: number;
}) {
  const canvas = document.createElement("canvas");
  canvas.setAttribute("width", String(width));
  canvas.setAttribute("height", String(height));

  const ctx = canvas.getContext("2d")!;
  const { unsubscribe: cleanup } = data$.subscribe((values) => {
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

  return { el: canvas, cleanup };
}
