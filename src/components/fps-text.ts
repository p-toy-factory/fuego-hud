import { distinctUntilChanged } from "rxjs";
import { fps$ } from "../rx/observables/fps";
import { defineComponent } from "./define-component";

export const createFpsTextElement = defineComponent(
  "fps-text",
  ({ onCleanup }) => {
    const el = document.createElement("div");
    const subscription = fps$.pipe(distinctUntilChanged()).subscribe((fps) => {
      el.textContent = `Framerate: ${fps}fps`;
    });
    onCleanup(() => subscription.unsubscribe());
    return el;
  }
);
