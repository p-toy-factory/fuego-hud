import { createFuegoGraphElement } from "./components/graph";
import { fps$ } from "./rx/observables/fps";
import { frametime$ } from "./rx/observables/frametime";
import { keepLast } from "./rx/operators/keep-last";
import { createFpsTextElement } from "./components/fps-text";
import { createFrametimeTextElement } from "./components/frametime-text";

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
    append(hudContainer, [
      fpsTextEl,
      fpsGraph,
      frametimeTextEl,
      frametimeGraph,
    ]),
  ]);

  return function closeFuegoHud() {
    hudContainer.remove();
  };
}

function append(node: HTMLElement, children: HTMLElement[]) {
  node.append(...children);
  return node;
}

runFuegoHud();
