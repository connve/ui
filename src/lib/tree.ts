export interface TreeNode<T> {
	name: string;
	fullPath: string;
	depth: number;
	isFolder: boolean;
	children?: TreeNode<T>[];
	leaf?: T;
	fileCount?: number;
}

const collator = new Intl.Collator(undefined, { numeric: true });

/**
 * Builds a slash-delimited path tree from a flat list; `path` returns each item's key.
 * Folders come first, then names in natural order ("item2" before "item10"), and each
 * folder's `fileCount` is its number of items, nested ones included. A key can name an
 * item and a folder at once ("a" and "a/b"); they become two nodes. Of items with the
 * same key, the first is kept.
 */
export function buildTree<T>(items: T[], path: (item: T) => string): TreeNode<T>[] {
	const root: TreeNode<T>[] = [];
	for (const item of items) {
		const parts = path(item).split('/').filter(Boolean);
		let level = root;
		parts.forEach((name, depth) => {
			const isFolder = depth < parts.length - 1;
			let node = level.find((n) => n.name === name && n.isFolder === isFolder);
			if (!node) {
				const fullPath = parts.slice(0, depth + 1).join('/');
				node = isFolder
					? { name, fullPath, depth, isFolder, children: [] }
					: { name, fullPath, depth, isFolder, leaf: item };
				level.push(node);
			}
			level = node.children ?? [];
		});
	}
	sortAndCount(root);
	return root;
}

/** Sorts a level and its folders, sets their `fileCount`, and returns the level's item count. */
function sortAndCount<T>(nodes: TreeNode<T>[]): number {
	nodes.sort((a, b) => Number(b.isFolder) - Number(a.isFolder) || collator.compare(a.name, b.name));
	let count = 0;
	for (const node of nodes) {
		if (node.children) {
			node.fileCount = sortAndCount(node.children);
			count += node.fileCount;
		} else {
			count += 1;
		}
	}
	return count;
}
