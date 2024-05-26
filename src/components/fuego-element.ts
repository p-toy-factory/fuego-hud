import { CleanupsManager } from "../utils/cleanups-manager";
import type { ICustomElementLifecycle } from "../types/custom-element-lifecycle";
import type { Constructor } from "../types/types";

export abstract class FuegoElement<TProps = {}>
  extends HTMLElement
  implements ICustomElementLifecycle
{
  private readonly cleanupsManager = new CleanupsManager();
  public props?: TProps;

  protected onCleanup(cleanup: () => void) {
    this.cleanupsManager.add(cleanup);
  }

  public connectedCallback() {
    if (!this.props) {
      throw new TypeError(`${this.nodeName}'s props is required`);
    }
    const shadow = this.attachShadow({ mode: "open" });
    const node = this.connectedCallbackWithProps(this.props);
    shadow.append(node);
  }

  protected abstract connectedCallbackWithProps(props: TProps): Node;

  public disconnectedCallback() {
    this.cleanupsManager.cleanup();
  }
}

export function registerFuegoElement<
  TFuegoElement extends FuegoElement<TProps>,
  TProps = {}
>(
  name: string,
  ctor: Constructor<TFuegoElement>
): (props: TProps) => TFuegoElement {
  customElements.define(name, ctor);

  function createFuegoElement(props: TProps) {
    const el = document.createElement(name) as TFuegoElement;
    el.props = props;
    return el;
  }

  return createFuegoElement;
}
