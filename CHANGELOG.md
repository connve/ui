# Changelog

## 0.3.0

### Added

- `CodingAgentsLink`, a link to where agents are set up, with the marks of the
  coding agents that connect over MCP, and an optional close button.
- `codingAgents`, those agents' names, docs anchors and marks (from Lobe Icons,
  MIT).

## 0.2.0

### Breaking

- `StateMessage`'s `message` is optional.
- `labels.resize` reads "Resize panel", and `labels.stateOops` "Something went
  wrong".

### Added

- Components for the public pages: `SiteHeader` with `SiteMenu`, its menu on a
  phone; `SiteFooter`; `NewsletterSignup`; `Wordmark`.
- Search: `SearchTrigger`, the header's search bar, and `SearchPalette`, the
  dialog, with `isSearchShortcut`, `searchShortcut` and `SEARCH_KEYS` for ⌘K
  and Ctrl+K.
- `prose.css` for long-form content under `class="prose"`, and the
  `codeCopy()` attachment, which adds a copy button to its code blocks.
- `code.css`, Prism syntax colors for both themes through `--prism-*`
  variables.
- `AppShell`'s `menuFooter`, the bottom of its menu on a phone, such as the
  theme; the menu starts with a close button, as `SiteMenu` does.
- The `icons` export, the bundled icons, with brand logos for the footer.
- `pageTitle()`, which joins a tab title.
- `text-brand`, text in the brand gradient, and the `--brand-from`,
  `--brand-via`, `--brand-to` and `--gradient-brand` variables.
- New `labels` for search and the newsletter.

### Fixed

- In a dialog, Tab no longer reaches elements with `tabindex="-1"`, so it
  stays inside the search dialog.
- The newsletter's email field reads on its band in both themes, autofilled
  too.
- A `StateMessage` glow fades out at its edges instead of ending in a line in a
  scrolling panel.
- `Badge`'s neutral variant keeps its text readable.

## 0.1.0

### Added

- The app shell: `AppShell` with its navigation rail, `SidePane`, `Inspector`
  and `InspectorSection`, `PaneResizer` and the shared pane sizes.
- Lists and marks: `FolderTree` with `buildTree`, `ListHeader`, `NavList`,
  `Badge`, `StatusDot`, `StateMessage`, `Loading`.
- Controls: `IconButton`, `CopyButton`, `EditButton`, `Segmented`,
  `ThemeToggle`.
- `Logo`.
- The `connve-light` and `connve-dark` themes in `theme.css`, with `theme` to
  pick and remember one, and the `chip`, `text-attention` and `no-spinner`
  utilities.
- `labels`, the components' texts, for an app to translate.
