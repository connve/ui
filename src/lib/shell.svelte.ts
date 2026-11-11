import { createContext, type Snippet } from 'svelte';

/** What a page's panes tell the `AppShell` they render in. */
export class ShellState {
	/** The page's side pane, rendered by the shell beside the menu so it reaches the top. */
	pane = $state<Snippet | null>(null);
	/** Opens a collapsed pane from the top bar on a phone, where its rail is hidden. */
	expand = $state<{ label: string; onclick: () => void } | null>(null);
	/** The top bar's button for `expand`, which takes focus back when a pane over the page closes. */
	expandButton = $state<HTMLButtonElement | null>(null);
	/** How many inspectors are open. */
	inspectors = $state(0);
}

const [get, set, has] = createContext<ShellState>();

export const setShell = set;

/** The enclosing `AppShell`'s state; `component` names the caller in the error when there's none. */
export function getShell(component: string): ShellState {
	if (!has()) throw new Error(`${component} must be inside an AppShell`);
	return get();
}
