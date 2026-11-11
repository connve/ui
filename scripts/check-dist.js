// Fails when dist/ still imports through an app alias such as `$lib` or `#lib`, which no
// consumer can resolve. publint passes such a package, so `npm run package` runs this too.

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const ALIAS = /['"](\$lib|#lib)(\/|['"])/;

const files = readdirSync('dist', { recursive: true, withFileTypes: true }).filter((entry) =>
	entry.isFile()
);
if (files.length === 0) {
	console.error('check-dist: dist/ is empty; run svelte-package first');
	process.exit(1);
}

const offenders = files
	.map((entry) => join(entry.parentPath, entry.name))
	.filter((file) => ALIAS.test(readFileSync(file, 'utf8')));

if (offenders.length > 0) {
	console.error(
		'check-dist: these files import through an alias; use relative imports in src/lib:'
	);
	for (const file of offenders) console.error(`  ${file}`);
	process.exit(1);
}
console.log(`check-dist: ${files.length} files, no aliases`);
