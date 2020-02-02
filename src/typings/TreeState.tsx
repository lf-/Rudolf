import {
  TreeForm,
  ContradictionNode,
  FormulaNode,
  FinishedNode,
} from './CarnapAPI'

/**
 * TODOS
 * 2. make closed nodes work more like output
 *  */
export interface TreeNodeProps {
  formulas: TreeForm[]
  rule: string
  id: string
}

export type TreeNode = FormulaNode | FinishedNode | ContradictionNode

export type NodeGenerator = (
  parentId: string,
  parentRow: number
) => FormulaNode[]

export type OpenLeafNode = FormulaNode & { forest: [] }
