import { describe, expect, it } from 'vitest';
import { buildTree, type TreeNode } from './tree.js';

const build = (paths: string[]) => buildTree(paths, (path) => path);

/** The tree as `name` for items and `name/ (count)` for folders, nested in arrays. */
function shape(nodes: TreeNode<string>[]): unknown[] {
	return nodes.map((node) =>
		node.children ? [`${node.name}/ (${node.fileCount})`, shape(node.children)] : node.name
	);
}

describe('buildTree', () => {
	it('puts folders first and counts nested items', () => {
		expect(
			shape(build(['shop/orders', 'intake', 'reports/daily/export', 'reports/weekly']))
		).toEqual([
			['reports/ (2)', [['daily/ (1)', ['export']], 'weekly']],
			['shop/ (1)', ['orders']],
			'intake'
		]);
	});

	it('sorts names in natural order', () => {
		expect(shape(build(['item10', 'item2', 'Item1']))).toEqual(['Item1', 'item2', 'item10']);
	});

	it('keeps an item and a folder of the same name apart, in either order', () => {
		for (const paths of [
			['a', 'a/b'],
			['a/b', 'a']
		]) {
			expect(shape(build(paths))).toEqual([['a/ (1)', ['b']], 'a']);
		}
	});

	it('keeps the first of items with the same key', () => {
		const tree = buildTree(
			[
				{ key: 'x', id: 1 },
				{ key: 'x', id: 2 }
			],
			(item) => item.key
		);
		expect(tree).toHaveLength(1);
		expect(tree[0].leaf?.id).toBe(1);
	});

	it('ignores empty segments and keys', () => {
		expect(shape(build(['/a//b/', '']))).toEqual([['a/ (1)', ['b']]]);
	});

	it('records each node’s path and depth', () => {
		const [folder] = build(['reports/daily/export']);
		const daily = folder.children![0];
		expect([folder.fullPath, folder.depth]).toEqual(['reports', 0]);
		expect([daily.fullPath, daily.depth]).toEqual(['reports/daily', 1]);
		expect(daily.children![0]).toMatchObject({
			fullPath: 'reports/daily/export',
			depth: 2,
			isFolder: false,
			leaf: 'reports/daily/export'
		});
	});
});
