// The color theme the viewer picked, applied to `<html data-theme>`.

import { MediaQuery } from 'svelte/reactivity';

export type ThemePref = 'system' | 'light' | 'dark';

const KEY = 'connve-theme';

function isPref(value: string | null): value is ThemePref {
	return value === 'system' || value === 'light' || value === 'dark';
}

function savedPref(): ThemePref {
	try {
		const saved = localStorage.getItem(KEY);
		return isPref(saved) ? saved : 'system';
	} catch {
		// No storage on the server, or blocked in the browser; the theme follows the OS.
		return 'system';
	}
}

class Theme {
	#pref = $state<ThemePref>(savedPref());
	#osDark = new MediaQuery('prefers-color-scheme: dark');

	/** The viewer's choice; `system` follows the OS. */
	get pref(): ThemePref {
		return this.#pref;
	}

	/** Whether the dark theme shows. */
	get dark(): boolean {
		return this.#pref === 'system' ? this.#osDark.current : this.#pref === 'dark';
	}

	/** Keeps `<html data-theme>` on the shown theme; call once from the root layout, and stop it with the returned function. */
	start(): () => void {
		return $effect.root(() => {
			$effect(() => {
				document.documentElement.setAttribute(
					'data-theme',
					this.dark ? 'connve-dark' : 'connve-light'
				);
			});
		});
	}

	set(pref: ThemePref) {
		this.#pref = pref;
		try {
			localStorage.setItem(KEY, pref);
		} catch {
			// Not remembered, but the theme still applies for this visit.
		}
	}
}

export const theme = new Theme();
