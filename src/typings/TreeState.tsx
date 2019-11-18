/**
 *  @TODO
 * 1. group formulas on single node in array.
 * 2. make closed nodes work more like output
 * 3. extract formula values to map
 *  */
export interface FormulaNode {
  label: string
  forest: [] | [TreeNode] | [TreeNode, TreeNode] | ClosingNode | FinishingNode
  resolved: boolean
  rule: string
  id: string
  row: number
}

export type TreeNode = FormulaNode | FinishingNode | ContradictionNode

type Formula = string
type Rule = string

export interface SharedContext {
  selectedNodeId: string | null
  nodeFormulas: { [id: string]: [Formula, Rule] }
  tree: FormulaNode
}

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

export type ContradictionNode = 'contradiction'
export type FinishingNode = 'finished'
export type ClosingNode = ContradictionNode | FinishingNode

export type BranchedNode = FormulaNode & { forest: [FormulaNode, FormulaNode] }

export type StackedNode = FormulaNode & { forest: [FormulaNode] }
