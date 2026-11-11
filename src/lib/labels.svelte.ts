/** Texts the components show; an app replaces them with its translations at startup. */
export const labels = $state({
	back: 'Back',
	close: 'Close',
	copy: 'Copy',
	copied: 'Copied',
	loading: 'Loading',
	resize: 'Resize the side panel with the arrow keys; Home or double-click resets it',
	new: 'New',
	edit: 'Edit',
	editReadOnly: 'Read-only, managed in the repository',
	menu: 'Menu',
	/** Names the main navigation; screen readers add "navigation". */
	navigation: 'Main',
	navExpand: 'Expand sidebar',
	navCollapse: 'Collapse sidebar',
	/** Names a navigation item that shows a count, when it has no `badgeLabel`. */
	navBadge: (label: string, count: number) => `${label}, ${count}`,
	breadcrumb: 'Breadcrumb',
	theme: 'Color theme',
	themeSystem: 'System',
	themeLight: 'Light',
	themeDark: 'Dark',
	themeOption: (theme: string) => `${theme} theme`,
	stateNotice: 'Nothing here yet',
	stateOops: 'Oops, something went wrong'
});

export type Labels = typeof labels;
