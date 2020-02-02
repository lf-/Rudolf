import {
  OpenLeafNode,
  NodeGenerator,
  NodeMutater,
  TreeNode,
} from '../typings/TreeState'
import {
  TreeForm,
  FormulaNode,
  ContradictionNode,
  FinishedNode,
} from '../typings/CarnapAPI'
import { lastEl } from './helpers'

export const makeNode = ({
  formulas = [],
  forest = [],
  rule = '',
  id,
}: Partial<FormulaNode> & {
  id: string
  row: number
}): FormulaNode => ({
  nodeType: 'formulas',
  formulas,
  forest,
  rule,
  id,
})

export const makeContradictionNode = (parentId: string): ContradictionNode => ({
  nodeType: 'contradiction',
  formulas: [],
  rule: 'X-PLACEHOLDER',
  id: `${parentId}0`,
})

export const makeFinishedNode = (parentId: string): FinishedNode => ({
  nodeType: 'finished',
  formulas: [],
  rule: 'X-PLACEHOLDER',
  id: `${parentId}0`,
})

/**
 *
 * @param root The root of a subTree
 * @param createNodes function that creates new node objects
 */
export const appendChildren = (
  root: TreeNode,
  createNodes: NodeGenerator
): TreeNode => {
  if (root.nodeType === 'contradiction') {
    return root
  } else if (root.nodeType === 'finished') {
    console.error("shouldn't try to append to finished branches.")
    // TODO: Special Handling for FinishedNodes?
    return root
  } else if (isOpenLeaf(root)) {
    return { ...root, forest: createNodes(root.id, lastRow(root) + 1) } // TODO
  } else {
    return {
      ...root,
      forest: root.forest.map<TreeNode>((child) =>
        appendChildren(child, createNodes)
      ),
    }
  }
}

/**
 *
 * @param root The root of a subTree
 * @param createNodes function that creates new node objects
 */
export const destructivelyAppendChildren = (
  root: TreeNode,
  createNodes: NodeGenerator
): void => {
  if (root.nodeType === 'contradiction') {
    return
  } else if (root.nodeType === 'finished') {
    // TODO: Special Handling for FinishedNodes?
    console.warn("shouldn't try to append to finished branch")
    return
  } else if (root.forest.length === 0) {
    root.forest = createNodes(root.id, -1)
  } else {
    root.forest.forEach((child) =>
      destructivelyAppendChildren(child, createNodes)
    )
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
    formulas: formulas.map((form, index) => makeTreeForm(form, index + row)),
    rule: 'A',
    forest: [],
    id,
    row,
  })
}

const makeTreeForm = (value = '', row: number): TreeForm => ({
  value,
  row,
  resolved: false,
})

export const mutateNode = <NodeType extends TreeNode>(
  root: TreeNode,
  targetNodeId: string,
  mutater: NodeMutater<NodeType>
): void => {
  if (root.id === targetNodeId) {
    mutater(root as NodeType)
  } else if (root.nodeType !== 'formulas') {
    return
  } else {
    root.forest.forEach((child) => mutateNode(child, targetNodeId, mutater))
  }
}

export const isOpenLeaf = (node: TreeNode | null): node is OpenLeafNode =>
  node != null && node.nodeType === 'formulas' && node.forest.length === 0

export const lastRow = (node: FormulaNode) => lastEl(node.formulas).row

export const firstRow = (node: FormulaNode) => node.formulas[0].row

export const makeFormulas = (n: number, nextRow: number): TreeForm[] => {
  const arr = []
  while (n-- > 0) {
    arr.push({ value: '', row: nextRow++, resolved: false })
  }
  return arr
}
