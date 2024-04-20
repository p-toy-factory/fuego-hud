import type { Observable, Subscription } from "rxjs";
import { FuegoElement, registerFuegoElement } from "./fuego-element";

export interface IReactiveElementProps {
  el: HTMLElement;
  subscription: Subscription;
}

export class ReactiveElement extends FuegoElement<IReactiveElementProps> {
  protected override connectedCallbackWithProps({
    el,
    subscription,
  }: IReactiveElementProps): Node {
    this.onCleanup(() => subscription.unsubscribe());
    return el;
  }
}

export const baseCreateReactiveElement = registerFuegoElement<
  ReactiveElement,
  IReactiveElementProps
>("reactive-element", ReactiveElement);

export function createReactiveElement<
  K extends keyof HTMLElementTagNameMap,
  Data
>(
  tagName: K,
  data$: Observable<Data>,
  subscriber: (element: HTMLElementTagNameMap[K], data: Data) => void
): ReactiveElement {
  const el = document.createElement(tagName);
  const subscription = data$.subscribe((data) => subscriber(el, data));
  return baseCreateReactiveElement({ el, subscription });
}
