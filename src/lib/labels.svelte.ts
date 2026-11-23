/** Texts the components show; an app replaces them with its translations at startup. */
export const labels = $state({
	back: 'Back',
	close: 'Close',
	copy: 'Copy',
	copied: 'Copied',
	loading: 'Loading',
	resize: 'Resize panel',
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
	stateOops: 'Something went wrong',
	required: 'Required',
	fieldHelp: 'About this field',
	remove: (item: string) => `Remove ${item}`,
	search: 'Search',
	searchPlaceholder: 'Search…',
	searchEmpty: 'Nothing found',
	searchUnavailable: 'Search is unavailable',
	updateAvailable: 'Update available',
	updateVersions: (latest: string, version: string) =>
		`Version ${latest} is out. This is ${version}.`,
	releaseNotes: 'Release notes',
	newsletterTitle: 'Get the edge.',
	newsletterSubtitle: 'News, releases, and insights — no noise.',
	newsletterEmail: 'Email address',
	newsletterPlaceholder: 'you@company.com',
	newsletterSubscribe: 'Subscribe',
	newsletterConsent:
		'I consent to receive marketing communication from CONNVE, including emails, ads, and personalised content. You can withdraw consent anytime.',
	newsletterDone: "You're in. Watch your inbox.",
	newsletterInvalidEmail: 'Please enter a valid email address.',
	newsletterConsentRequired: 'Please agree to receive marketing communication.'
});

export type Labels = typeof labels;
