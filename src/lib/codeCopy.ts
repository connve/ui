import { mount, unmount } from 'svelte';
import type { Attachment } from 'svelte/attachments';
import CopyButton from './CopyButton.svelte';

/** Puts a copy button in every code block inside the element, including blocks
 * rendered later, such as the next page's; `prose.css` lays it out. */
export function codeCopy(label?: string): Attachment<HTMLElement> {
	return (node) => {
		const buttons = new Map<HTMLPreElement, ReturnType<typeof mount>>();

		function sync() {
			for (const [pre, button] of buttons) {
				if (pre.isConnected) continue;
				unmount(button);
				buttons.delete(pre);
			}
			for (const pre of node.querySelectorAll('pre')) {
				if (buttons.has(pre)) continue;
				const text = (pre.querySelector('code') ?? pre).textContent?.trimEnd() ?? '';
				const host = document.createElement('div');
				host.className = 'code-copy';
				pre.append(host);
				buttons.set(pre, mount(CopyButton, { target: host, props: { text, label } }));
			}
		}

		sync();
		const observer = new MutationObserver(sync);
		observer.observe(node, { childList: true, subtree: true });
		return () => {
			observer.disconnect();
			for (const button of buttons.values()) unmount(button);
		};
	};
}
