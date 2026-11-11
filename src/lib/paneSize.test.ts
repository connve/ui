import { describe, expect, it } from 'vitest';
import { PaneSize } from './paneSize.svelte.js';

const key = (name: string) => ({ key: name, preventDefault() {} }) as KeyboardEvent;

describe('PaneSize', () => {
	it('starts at its initial size', () => {
		const pane = new PaneSize('test-initial', { initial: 300, min: 200, max: 400, edge: 'right' });
		expect(pane.size).toBe(300);
		expect([pane.min, pane.max]).toEqual([200, 400]);
	});

	it('grows toward its resizing edge with the arrow keys', () => {
		const left = new PaneSize('test-left', { initial: 300, min: 200, max: 400, edge: 'right' });
		left.keydown(key('ArrowRight'));
		expect(left.size).toBe(316);

		const right = new PaneSize('test-right', { initial: 300, min: 200, max: 400, edge: 'left' });
		right.keydown(key('ArrowLeft'));
		expect(right.size).toBe(316);

		const bottom = new PaneSize('test-bottom', { initial: 300, min: 200, max: 400, edge: 'top' });
		bottom.keydown(key('ArrowUp'));
		expect(bottom.size).toBe(316);
		expect(bottom.vertical).toBe(true);
	});

	it('stays within its bounds and resets with Home', () => {
		const pane = new PaneSize('test-bounds', { initial: 390, min: 380, max: 400, edge: 'right' });
		pane.keydown(key('ArrowRight'));
		expect(pane.size).toBe(400);
		pane.keydown(key('ArrowLeft'));
		pane.keydown(key('ArrowLeft'));
		expect(pane.size).toBe(380);
		pane.keydown(key('Home'));
		expect(pane.size).toBe(390);
	});

	it('leaves other keys alone', () => {
		const pane = new PaneSize('test-other', { initial: 300, min: 200, max: 400, edge: 'right' });
		let prevented = false;
		const event = {
			key: 'ArrowUp',
			preventDefault() {
				prevented = true;
			}
		} as KeyboardEvent;
		pane.keydown(event);
		expect(pane.size).toBe(300);
		expect(prevented).toBe(false);
	});
});
