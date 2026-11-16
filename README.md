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

On a phone the `AppShell` rail becomes a menu laid out like `SiteMenu`: a close button on top and `menuFooter` at the bottom. Put the `ThemeToggle` there, and hide the one in `actions` on small screens with `max-sm:hidden`, as the docs do.

`labels`, `theme` and the pane sizes are module state, so they suit single-page apps; with server rendering they would be shared between requests.

## Search

`SearchTrigger` is the header's search bar, an icon on a phone, and `isSearchShortcut` matches ⌘K or Ctrl+K. `SearchPalette` is the dialog: the app passes its results by group, a `row` snippet, and what Enter does; the dialog handles the input, the keyboard and focus.

## Public pages

`SiteHeader` is the sticky header of the public pages, and `SiteMenu` its drawer on a phone: bind the header's `menuButton` and pass it as the menu's `returnFocus`. `NewsletterSignup` collects an address with consent and hands it to `onsubscribe`. `pageTitle('Page', 'Section', 'App')` joins a tab title.

`prose.css` styles long-form content under `class="prose"`, and the `codeCopy()` attachment adds a copy button to its code blocks. It replaces `@tailwindcss/typography`'s `prose`, so don't use both in one app:

```css
@import '@connve/ui/prose.css';
```

## Footer

`SiteFooter` is the footer of the public pages: the logo, the company's address and its links. Each text and the links can be replaced.

## Icons

The components' own icons are bundled, so they show at once and need no network; `icons` exports them for the apps. Icons an app passes by name, such as `NavItem.icon: 'tabler:home'`, load from the Iconify API at runtime: allow `https://api.iconify.design` in `connect-src`, or pass icon data instead (`IconifyIcon` from `@iconify/svelte`).

## Styles

`theme.css` also adds utilities for the apps: `chip` with `chip-sm`, `chip-neutral`, `chip-success`, `chip-warn`, `chip-error` and `chip-inactive`; `text-attention` for warning text; `text-brand` for text in the brand gradient; and `no-spinner` for number inputs. It sets `table-sm` body rows to `text-sm` and gives clickable rows (`tr[role='button']`) a focus ring. The brand colors are `--brand-from`, `--brand-via` and `--brand-to`, and `--gradient-brand` blends them; an app overrides any of them after the import.

`code.css` colors Prism syntax highlighting in both themes, through `--prism-*` variables an app can override:

```css
@import '@connve/ui/code.css';
```

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

Bump `version` in `package.json` and merge to `main`. After CI passes, the release workflow stages the version on npm, with provenance, when npm doesn't have it yet, and creates its GitHub release when it has no tag yet. A version with a suffix, such as `1.2.0-next.1`, goes to the `next` dist-tag.

Publishing happens only in CI, through npm's trusted publishing: the workflow stages the version (`npm stage publish`), and a maintainer approves it on npmjs.com, or with `npm stage approve <id>`, before it goes live. Until then npm doesn't have the version, so a later push to `main` stages it again.

## License

MPL-2.0
