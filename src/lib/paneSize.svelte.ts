// Size of a resizable pane, remembered in this browser.

const KEY_STEP = 16;

export interface PaneBounds {
	initial: number;
	min: number;
	max: number;
	/** The pane's edge that resizes it: `right` for a pane on the left, `left` for one on the right, `top` for one at the bottom. */
	edge: 'left' | 'right' | 'top';
}

export class PaneSize {
	#size = $state(0);
	#dragging = $state(false);
	readonly edge: PaneBounds['edge'];
	#bounds: PaneBounds;
	#key: string;

	constructor(key: string, bounds: PaneBounds) {
		this.#key = `connve-${key}-pane-${bounds.edge === 'top' ? 'height' : 'width'}`;
		this.#bounds = bounds;
		this.edge = bounds.edge;
		this.#size = bounds.initial;
		try {
			const saved = Number(localStorage.getItem(this.#key));
			if (saved > 0) this.#size = this.#clamp(saved);
		} catch {
			// No storage on the server, or blocked in the browser; the initial size still works.
		}
	}

	/** In pixels, within the bounds. */
	get size(): number {
		return this.#size;
	}

	/** Whether a pointer is resizing the pane. */
	get dragging(): boolean {
		return this.#dragging;
	}

	get vertical(): boolean {
		return this.edge === 'top';
	}

	get min(): number {
		return this.#bounds.min;
	}

	get max(): number {
		return this.#bounds.max;
	}

	#clamp(size: number): number {
		return Math.min(this.#bounds.max, Math.max(this.#bounds.min, Math.round(size)));
	}

	#save() {
		try {
			localStorage.setItem(this.#key, String(this.#size));
		} catch {
			// Not remembered, but the pane keeps its size for this visit.
		}
	}

	/** Size change for a pointer or key moving `delta` pixels right, or down for a bottom pane. */
	#grow(delta: number): number {
		return this.edge === 'right' ? delta : -delta;
	}

	start = (event: PointerEvent) => {
		if (event.button !== 0) return;
		const handle = event.currentTarget as HTMLElement;
		const startAt = this.vertical ? event.clientY : event.clientX;
		const startSize = this.#size;
		handle.setPointerCapture(event.pointerId);
		this.#dragging = true;
		const move = (e: PointerEvent) => {
			const at = this.vertical ? e.clientY : e.clientX;
			this.#size = this.#clamp(startSize + this.#grow(at - startAt));
		};
		const end = () => {
			this.#dragging = false;
			handle.removeEventListener('pointermove', move);
			handle.removeEventListener('pointerup', end);
			handle.removeEventListener('pointercancel', end);
			this.#save();
		};
		handle.addEventListener('pointermove', move);
		handle.addEventListener('pointerup', end);
		handle.addEventListener('pointercancel', end);
	};

	reset = () => {
		this.#size = this.#bounds.initial;
		this.#save();
	};

	keydown = (event: KeyboardEvent) => {
		if (event.key === 'Home') {
			event.preventDefault();
			this.reset();
			return;
		}
		const keys: Record<string, number> = this.vertical
			? { ArrowUp: -KEY_STEP, ArrowDown: KEY_STEP }
			: { ArrowLeft: -KEY_STEP, ArrowRight: KEY_STEP };
		const delta = keys[event.key];
		if (delta === undefined) return;
		event.preventDefault();
		this.#size = this.#clamp(this.#size + this.#grow(delta));
		this.#save();
	};
}

/** One width for every page's side pane, so switching pages keeps the divider in place. */
export const sidePaneWidth = new PaneSize('side', {
	initial: 256,
	min: 200,
	max: 520,
	edge: 'right'
});

/** One width for every page's inspector. */
export const inspectorWidth = new PaneSize('inspector', {
	initial: 480,
	min: 360,
	max: 800,
	edge: 'left'
});
