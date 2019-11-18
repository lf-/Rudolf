import {
  OpenLeafNode,
  NodeGenerator,
  NodeUpdater,
  TreeNode,
  ClosedLeafNode,
  FinishedLeafNode,
  FinishingNode,
} from '../typings/TreeState'
import { ContradictionNode } from '../typings/CarnapAPI'

export const makeNode = ({
  label = '',
  forest = [],
  rule = '',
  id,
  row,
}: Partial<TreeNode> & {
  id: string
  row: number
}): TreeNode => ({
  label,
  forest,
  resolved: false,
  rule,
  id,
  row,
})

/**
 *
 * @param root The root of a subTree
 * @param newNodes nodes to append, as-is, to the bottom of all open branches.
 */
export const appendChildren = (
  root: TreeNode,
  createNodes: NodeGenerator
): TreeNode => {
  if (typeof root.forest === 'string') {
    return root
  } else if (root.forest.length === 0) {
    return { ...root, forest: createNodes(root.id, root.row) }
  } else {
    return {
      ...root,
      forest: root.forest.map<TreeNode>((child: TreeNode) =>
        appendChildren(child, createNodes)
      ),
    }
  }
}

/**
 *
 * @param formulas an array of of formulas.
 */
export const parsePremises = (
  formulas: string[],
  parentId: string,
  row: number
): TreeNode => {
  const id = `${parentId}0`
  return makeNode({
    label: formulas[0],
    rule: 'A',
    forest:
      formulas.length > 1
        ? [parsePremises(formulas.slice(1), id, row + 1)]
        : [],
    id,
    row,
  })
}

const makeBranch = (
  formulas: string[],
  parentId: string,
  parentRow: number
): TreeNode => {
  const id = `${parentId}0`
  const row = parentRow + 1
  return makeNode({
    label: formulas[0],
    forest: [makeBranch(formulas.slice(1), id, row)],
    id,
    row,
  })
}

export const updateNode = (
  root: TreeNode,
  targetNode: TreeNode,
  updater: NodeUpdater
): TreeNode => {
  if (root === targetNode) {
    return updater({ ...root })
  } else if (typeof root.forest === 'string') {
    return root
  } else {
    return {
      ...root,
      forest: root.forest.map((child) =>
        updateNode(child, targetNode, updater)
      ),
    }
  }
}

export const isOpenLeaf = (node: TreeNode | null): node is OpenLeafNode =>
  node != null && Array.isArray(node.forest) && node.forest.length === 0

export const isFinishedLeaf = (
  node: TreeNode | null
): node is FinishedLeafNode => node != null && node.forest === 'finished'

export const isContradictionLeaf = (
  node: TreeNode | null
): node is ClosedLeafNode => node != null && node.forest === 'contradiction'

export const isClosedLeaf = (node: TreeNode) =>
  isFinishedLeaf(node) || isContradictionLeaf(node)

export const isFinishingNode = (forest: TreeNode): forest is FinishingNode =>
  forest === 'finished'
export const isContradictionNode = (
  node: TreeNode
): node is ContradictionNode => node === 'contradiction'

export const isClosingNode = (node: TreeNode) =>
  isFinishingNode(node) || isContradictionNode(node)

export const hasSingleChild = (node: TreeNode) => node.forest.length === 1

export const hasTwoChildren = (node: TreeNode): node is BranchedNode =>
  node.forest.length === 2
