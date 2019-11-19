import {
  OpenLeafNode,
  NodeGenerator,
  NodeUpdater,
  TreeNode,
  ClosedLeafNode,
  FinishedLeafNode,
  FinishingNode as FinishedNode,
  BranchedNode,
  StackedNode,
  ContradictionNode,
  FormulaNode,
  ClosingNode,
  ContradictionLeafNode,
} from '../typings/Trees'

export const makeNode = ({
  label = '',
  forest = [],
  rule = '',
  id,
  row,
}: Partial<FormulaNode> & {
  id: string
  row: number
}): FormulaNode => ({
  nodeType: 'formulas',
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
  root: FormulaNode,
  createNodes: NodeGenerator
): [FormulaNode, string[]] => {
  if (isOpenLeaf(root)) {
    const [forest, ids] = createNodes(root.id, root.row)
    return [{ ...root, forest }, ids]
  } else if (isStackedNode(root)) {
    const [child, ids] = appendChildren(root.forest[0], createNodes)
    return [
      {
        ...root,
        forest: [child],
      },
      ids,
    ]
  } else if (isBranchedNode(root)) {
    const [leftChild, leftIds] = appendChildren(root.forest[0], createNodes)
    const [rightChild, rightIds] = appendChildren(root.forest[1], createNodes)
    return [
      {
        ...root,
        forest: [leftChild, rightChild],
      },
      leftIds.concat(rightIds),
    ]
  } else {
    return [root, []]
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
): FormulaNode => {
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

export const updateNode = (
  root: FormulaNode,
  targetNode: FormulaNode,
  updater: NodeUpdater
): FormulaNode => {
  if (root === targetNode) {
    return updater({ ...root })
  } else if (isClosingNode(root)) {
    return root
  } else if (nodeHasChildren(root)) {
    return {
      ...root,
      forest: root.forest.map((child: FormulaNode) =>
        updateNode(child, targetNode, updater)
      ) as [FormulaNode] | [FormulaNode],
    }
  } else {
    console.error('Attempted invalid node update')
    return root
  }
}

export const isOpenLeaf = (node: TreeNode | null): node is OpenLeafNode =>
  node != null &&
  isFormulaNode(node) &&
  Array.isArray(node.forest) &&
  node.forest.length === 0

export const isFinishedLeaf = (
  node: FormulaNode | null
): node is FinishedLeafNode => node != null && isFinishedNode(node.forest[0])

export const isContradictionLeaf = (
  node: FormulaNode | null
): node is ContradictionLeafNode =>
  node != null && isContradictionNode(node.forest[0])

export const isClosedLeaf = (node: TreeNode): node is ClosedLeafNode =>
  isFormulaNode(node) && (isFinishedLeaf(node) || isContradictionLeaf(node))

export const isFormulaNode = (node: TreeNode): node is FormulaNode => {
  return node.nodeType === 'formulas'
}

export const isFinishedNode = (
  node?: TreeNode | FinishedNode | ContradictionNode
): node is FinishedNode => node?.nodeType === 'finished'

export const isContradictionNode = (
  node?: TreeNode | FinishedNode | ContradictionNode
): node is ContradictionNode => node?.nodeType === 'contradiction'

export const isClosingNode = (node?: TreeNode): node is ClosingNode =>
  node?.nodeType === 'finished' || node?.nodeType === 'contradiction'

export const isStackedNode = (node: FormulaNode): node is StackedNode =>
  node.forest.length === 1

export const isBranchedNode = (node: FormulaNode): node is BranchedNode =>
  node.forest.length === 2

export const nodeHasChildren = (
  node: TreeNode
): node is StackedNode | BranchedNode => {
  return (
    isFormulaNode(node) &&
    (isStackedNode(node) || isBranchedNode(node)) &&
    isFormulaNode(node.forest[0])
  )
}

export const makeContradictionNode = () =>
  ({ rule: 'contradiction', nodeType: 'contradiction' } as const)
export const makeFinishedNode = () =>
  ({ rule: 'finished', nodeType: 'finished' } as const)
