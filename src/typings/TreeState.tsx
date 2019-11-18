/**
 *  @TODO
 * 1. group formulas on single node in array.
 * 2. make closed nodes work more like output
 * 3. extract formula values to map
 *  */
export interface FormulaNode {
  label: string
  forest: [] | [TreeNode] | [TreeNode, TreeNode] | [ClosingNode]
  resolved: boolean
  rule: Exclude<string, 'finished' | 'contradiction'>
  id: string
  row: number
}

export type ContradictionNode = { rule: 'contradiction' }
export type FinishingNode = { rule: 'finished' }
export type ClosingNode = ContradictionNode | FinishingNode

export type TreeNode = FormulaNode | FinishingNode | ContradictionNode

export type Formula = string
export type Rule = string

// export interface TreeForm {
//   value: string
//   resolved: boolean
//   row: number
// }

export type NodeGenerator =
  | ((parentId: string, parentRow: number) => [FormulaNode])
  | ((parentId: string, parentRow: number) => [FormulaNode, FormulaNode])

export type NodeUpdater = (node: FormulaNode) => FormulaNode

export type OpenLeafNode = FormulaNode & { forest: [] }

export type ContradictionLeafNode = FormulaNode & { forest: ContradictionNode }

export type FinishedLeafNode = FormulaNode & { forest: FinishingNode }

export type ClosedLeafNode = ContradictionLeafNode | FinishedLeafNode

export type BranchedNode = FormulaNode & { forest: [FormulaNode, FormulaNode] }

export type StackedNode = FormulaNode & { forest: [FormulaNode] }
