# @connve/ui

Svelte 5 components and the theme shared by the CONNVE apps: an app shell with a navigation rail, side panes, inspectors, lists and status marks. Built on Tailwind CSS 4 and daisyUI 5.

## Install

```sh
npm install @connve/ui @iconify/svelte daisyui tailwindcss
```

Import the theme after Tailwind and daisyUI in the app's stylesheet. `themes: false` leaves out daisyUI's own themes, so a dark OS gets the CONNVE dark theme before the app starts:

```css
@import 'tailwindcss';
@plugin 'daisyui' {
	themes: false;
}
@import '@connve/ui/theme.css';
```

Start the theme once in the root layout:

```svelte
<script lang="ts">
	import { onMount } from 'svelte';
	import { AppShell, ThemeToggle, theme } from '@connve/ui';

	onMount(() => theme.start());
</script>
```

`theme.start()` runs after the first paint. To open in the saved theme without a light flash, set it in `src/app.html` before `%sveltekit.head%`:

```html
<script>
	try {
		var saved = localStorage.getItem('connve-theme');
		var dark =
			saved === 'dark' || (saved !== 'light' && matchMedia('(prefers-color-scheme: dark)').matches);
		document.documentElement.setAttribute('data-theme', dark ? 'connve-dark' : 'connve-light');
	} catch (e) {}
</script>
```

## Layout

`SidePane` and `Inspector` place themselves through `AppShell`: a page's `SidePane` renders beside the navigation rail, and an open `Inspector` folds it on narrow screens. Outside an `AppShell` they throw. On a phone both cover the page and act as dialogs.

`labels`, `theme` and the pane sizes are module state, so they suit single-page apps; with server rendering they would be shared between requests.

## Icons

The components' own icons are bundled, so they show at once and need no network. Icons an app passes by name, such as `NavItem.icon: 'tabler:home'`, load from the Iconify API at runtime: allow `https://api.iconify.design` in `connect-src`, or pass icon data instead (`IconifyIcon` from `@iconify/svelte`).

## Styles

`theme.css` also adds utilities for the apps: `chip` with `chip-sm`, `chip-neutral`, `chip-success`, `chip-warn`, `chip-error` and `chip-inactive`; `text-attention` for warning text; and `no-spinner` for number inputs. It sets `table-sm` body rows to `text-sm` and gives clickable rows (`tr[role='button']`) a focus ring.

## Texts

Components show English texts from `labels`. An app with translations replaces them at startup:

```ts
import { labels } from '@connve/ui';

labels.close = m.common_close();
```

## Develop

```sh
npm install
npm run dev      # the component showcase
npm run check    # types
npm run lint     # prettier and eslint; `npm run format` fixes formatting
npm test         # unit tests
npm run package  # builds dist/, runs publint and checks dist/ for aliases
npm run icons    # regenerates src/lib/icons.ts after adding a name in scripts/icons.js
```

## Release

Bump `version` in `package.json` and merge to `main`. After CI passes, the release workflow publishes the version to npm with provenance when npm doesn't have it yet, and creates its GitHub release when it has no tag yet. A version with a suffix, such as `1.2.0-next.1`, goes to the `next` dist-tag.

Publishing happens only in CI. npm sets up trusted publishing on an existing package, so the first version goes out with a token:

1. On npmjs.com, create a granular access token with read and write access to the `@connve` scope, and save it as the `NPM_TOKEN` secret of the GitHub repository.
2. Push to `main`; the workflow publishes the first version with that token.
3. On the package's settings page, add a trusted publisher: GitHub Actions, `connve/ui`, workflow `release.yml`, allowed to `npm publish`. Then delete the `NPM_TOKEN` secret and revoke the token, and set the package to require 2FA and disallow tokens.

## License

MPL-2.0
