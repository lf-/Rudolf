import {
  BranchedNode,
  ClosingNode,
  ContradictionNode,
  FinishingNode as FinishedNode,
  FormulaNode,
  NodeGenerator,
  NodeUpdater,
  LeafNode,
  StackedNode,
  TreeNode,
  TreeForm,
} from '../typings/Trees'

export const makeNode = ({
  id,
  formulas,
  row,
  rule = '',
}: Partial<Omit<FormulaNode, 'formulas'>> & {
  id: string
  formulas: string[]
  row: number
}): FormulaNode => ({
  nodeType: 'formulas',
  forest: [],
  rule,
  id,
  formulas: makeTreeForms(formulas, row),
})

const makeTreeForms = (formulas: string[], row: number): TreeForm[] => {
  return formulas.map(
    (value: string): TreeForm => {
      const form: TreeForm = { value, row, resolved: false }
      row += 1
      return form
    }
  )
}

export const makeContradictionNode = (parentId: string): ContradictionNode => ({
  rule: 'X',
  nodeType: 'contradiction',
  id: `${parentId}0`,
  formulas: [],
})

export const makeFinishedNode = (parentId: string): FinishedNode => ({
  rule: 'O',
  nodeType: 'finished' as const,
  id: `${parentId}0`,
  formulas: [],
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
    const [forest, ids] = createNodes(root.id, lastRow(root))
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

export const lastRow = (node: TreeNode) => {
  return node.formulas[-1].row
}

export const updateNode = (
  root: FormulaNode,
  targetNodeId: string,
  updater: NodeUpdater
): FormulaNode => {
  if (root.id === targetNodeId) {
    return updater({ ...root })
  } else if (nodeHasChildren(root)) {
    return {
      ...root,
      forest: root.forest.map((child: FormulaNode) =>
        updateNode(child, targetNodeId, updater)
      ) as [FormulaNode] | [FormulaNode, FormulaNode],
    }
  } else {
    console.error('Attempted invalid node update')
    return root
  }
}

export const isOpenLeaf = (node?: TreeNode): node is LeafNode =>
  isFormulaNode(node) && node?.forest.length === 0

export const isFormulaNode = (node?: TreeNode): node is FormulaNode => {
  return node?.nodeType === 'formulas'
}

export const isFinishedNode = (
  node?: TreeNode | FinishedNode | ContradictionNode
): node is FinishedNode => node?.nodeType === 'finished'

export const isContradictionNode = (
  node?: TreeNode | FinishedNode | ContradictionNode
): node is ContradictionNode => node?.nodeType === 'contradiction'

export const isClosingNode = (node?: TreeNode): node is ClosingNode =>
  isFinishedNode(node) || isContradictionNode(node)

export const isStackedNode = (node?: TreeNode): node is StackedNode =>
  isFormulaNode(node) && node?.forest.length === 1

export const isBranchedNode = (node?: TreeNode): node is BranchedNode =>
  isFormulaNode(node) && node?.forest.length === 2

export const nodeHasChildren = (
  node?: TreeNode
): node is StackedNode | BranchedNode => {
  return isStackedNode(node) || isBranchedNode(node)
}
