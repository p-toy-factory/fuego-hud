import {
  bufferTime,
  distinctUntilChanged,
  filter,
  map,
  max,
  mergeMap,
  reduce,
  windowTime,
  zip,
} from "rxjs";
import { frametime$ } from "../rx/observables/frametime";
import { createReactiveElement } from "./reactive-element";

export function createFrametimeTextElement() {
  const frametimePerSecond$ = frametime$.pipe(bufferTime(1000));

  const frametimeAvgPerSecond$ = frametimePerSecond$.pipe(
    map((arr) =>
      (arr.reduce((acc, cur) => acc + cur, 0) / (arr.length || 1)).toFixed(1)
    ),
    distinctUntilChanged()
  );

  const frametimeMaxPerSecond$ = frametimePerSecond$.pipe(
    map((arr) => arr.reduce((acc, cur) => Math.max(acc, cur), 0).toFixed(1)),
    distinctUntilChanged()
  );

  const frametimeTextEl = createReactiveElement(
    "div",
    zip(frametimeAvgPerSecond$, frametimeMaxPerSecond$),
    (el, [avgFrametime, maxFrametime]) => {
      el.innerHTML = `Frametime: <sub>avg</sub>${avgFrametime} / <sub>max</sub>${maxFrametime} ms`;
    }
  );

  return frametimeTextEl;
}
