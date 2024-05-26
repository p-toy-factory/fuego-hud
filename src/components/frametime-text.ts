import { bufferTime, distinctUntilChanged, map } from "rxjs";
import { frametime$ } from "../rx/observables/frametime";
import { append } from "../utils/append";
import { FuegoElement, registerFuegoElement } from "./fuego-element";

class FrametimeTextElement extends FuegoElement {
  protected override connectedCallbackWithProps(): Node {
    const frametimePerSecond$ = frametime$.pipe(bufferTime(1000));

    // #region Average frametime per second
    const avg = document.createElement("span");

    const frametimeAvgPerSecond$ = frametimePerSecond$.pipe(
      map((arr) =>
        (arr.reduce((acc, cur) => acc + cur, 0) / (arr.length || 1)).toFixed(1)
      ),
      distinctUntilChanged()
    );

    const avgSubscription = frametimeAvgPerSecond$.subscribe((avgFrametime) => {
      avg.innerHTML = `Frametime: <sub>avg</sub>${avgFrametime}`;
    });

    this.onCleanup(() => avgSubscription.unsubscribe());
    // #endregion

    // #region Max frametime per second
    const max = document.createElement("span");

    const frametimeMaxPerSecond$ = frametimePerSecond$.pipe(
      map((arr) => arr.reduce((acc, cur) => Math.max(acc, cur), 0).toFixed(1)),
      distinctUntilChanged()
    );

    const maxSubscription = frametimeMaxPerSecond$.subscribe((maxFrametime) => {
      max.innerHTML = `<sub>max</sub>${maxFrametime} ms`;
    });

    this.onCleanup(() => maxSubscription.unsubscribe());
    // #endregion

    return append(document.createElement("div"), [
      avg,
      document.createTextNode(" / "),
      max,
    ]);
  }
}

export const createFrametimeTextElement =
  registerFuegoElement<FrametimeTextElement>(
    "fuego-frametime-text",
    FrametimeTextElement
  );
