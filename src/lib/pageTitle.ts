/**
 * Browser tab title shared by the CONNVE apps: most specific first, then the
 * section, then the app, joined with ` · `; empty parts are skipped.
 *
 * @example pageTitle('Page', 'Section', 'App') // 'Page · Section · App'
 * @example pageTitle(undefined, 'Section', 'App') // 'Section · App'
 */
export function pageTitle(...parts: Array<string | null | undefined>): string {
	return parts.filter((part): part is string => !!part).join(' · ');
}
