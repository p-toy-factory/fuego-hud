import { bufferTime, distinctUntilChanged, filter, map } from "rxjs";
import { graph } from "./components/graph";
import { fps$ } from "./rx/observables/fps";
import { frametime$ } from "./rx/observables/frametime";
import { keepLast } from "./rx/operators/keep-last";

export function runFuegoHud() {
  const hudContainer = document.createElement("div");
  hudContainer.id = "fuego-hud";
  hudContainer.setAttribute(
    "style",
    [
      "position: fixed",
      "top: 0",
      "left: 0",
      "background: #ffffff7f",
      "pointer-events: none",
      "z-index: 114514",
    ].join("; ")
  );

  const fpsText = document.createElement("div");
  const fpsSubscription = fps$.pipe(distinctUntilChanged()).subscribe((fps) => {
    fpsText.textContent = `Framerate: ${fps}fps`;
  });

  const graphWidth = 60 * 3;
  const seed = new Array(graphWidth).fill(0);

  const fpss$ = fps$.pipe(keepLast(graphWidth, seed));
  const { el: fpsGraph, cleanup: cleanupFpsGraph } = graph({
    data$: fpss$,
    height: 60,
    width: graphWidth,
  });

  const frametimeText = document.createElement("div");
  const frametimeSubscription = frametime$
    .pipe(
      bufferTime(1000),
      filter((arr) => arr.length > 0),
      map((arr) =>
        // TODO: cur may lt 1000
        (arr.reduce((acc, cur) => acc + cur, 0) / arr.length).toFixed(1)
      ),
      distinctUntilChanged()
    )
    .subscribe((frametime) => {
      frametimeText.textContent = `Frametime: ${frametime}ms`;
    });

  const frametimes$ = frametime$.pipe(keepLast(graphWidth, seed));
  const { el: frametimeGraph, cleanup: cleanupFrametimeGraph } = graph({
    data$: frametimes$,
    height: 50,
    width: graphWidth,
  });

  const container = document.body;
  container.appendChild(hudContainer);
  hudContainer.appendChild(fpsText);
  hudContainer.appendChild(fpsGraph);
  hudContainer.appendChild(frametimeText);
  hudContainer.appendChild(frametimeGraph);

  return function closeFuegoHud() {
    fpsSubscription.unsubscribe();
    cleanupFpsGraph();
    frametimeSubscription.unsubscribe();
    cleanupFrametimeGraph();
    hudContainer.remove();
  };
}

runFuegoHud();
