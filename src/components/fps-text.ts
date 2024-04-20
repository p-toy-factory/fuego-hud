import { distinctUntilChanged } from "rxjs";
import { createReactiveElement } from "./reactive-element";
import { fps$ } from "../rx/observables/fps";

export function createFpsTextElement() {
  const fpsTextEl = createReactiveElement(
    "div",
    fps$.pipe(distinctUntilChanged()),
    (el, fps) => {
      el.textContent = `Framerate: ${fps}fps`;
    }
  );
  return fpsTextEl;
}
