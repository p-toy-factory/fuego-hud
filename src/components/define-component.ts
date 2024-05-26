import { CleanupsManager } from "../utils/cleanups-manager";
import type { ICustomElementLifecycle } from "../types/custom-element-lifecycle";

abstract class BaseFuegoComponent<TProps = undefined>
	extends HTMLElement
	implements ICustomElementLifecycle
{
	private readonly cleanupsManager = new CleanupsManager();
	public props!: TProps;

	protected onCleanup(cleanup: () => void) {
		this.cleanupsManager.add(cleanup);
	}

	public connectedCallback() {
		const shadow = this.attachShadow({ mode: "open" });
		const node = this.connectedCallbackWithProps(this.props);
		shadow.append(node);
	}

	protected abstract connectedCallbackWithProps(props: TProps): Node;

	public disconnectedCallback() {
		this.cleanupsManager.cleanup();
	}
}

export function defineComponent<TProps = undefined>(
	name: string,
	render: (ctx: {
		props: TProps;
		onCleanup: (cleanup: () => void) => void;
	}) => Node,
): TProps extends undefined
	? () => BaseFuegoComponent
	: (props: TProps) => BaseFuegoComponent {
	class FuegoComponent extends BaseFuegoComponent<TProps> {
		connectedCallbackWithProps(props: TProps) {
			return render({
				props,
				onCleanup: this.onCleanup.bind(this),
			});
		}
	}

	const nameWithPrefix = `fuego-${name}`;
	customElements.define(nameWithPrefix, FuegoComponent);

	function createFuegoElement(props: TProps) {
		const el = document.createElement(nameWithPrefix) as FuegoComponent;
		el.props = props;
		return el;
	}

	// @ts-expect-error Can not be inferred
	return createFuegoElement;
}
