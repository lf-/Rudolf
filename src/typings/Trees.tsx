/**
 *  @TODO
 * 1. group formulas on single node in array.
 * 2. make closed nodes work more like output
 * 3. extract formula values to map
 *  */
interface NodeProps {
  rule: string
  id: string
}

export interface TreeForm {
  row: number
  value: string
  resolved: boolean
}

export interface FormulaNode extends NodeProps {
  rule: string
  nodeType: 'formulas'
  forest: [] | [ClosingNode] | [FormulaNode] | [FormulaNode, FormulaNode]
}

export interface ContradictionNode extends NodeProps {
  nodeType: 'contradiction'
  rule: 'X'
  id: string
}
export interface FinishingNode extends NodeProps {
  nodeType: 'finished'
  rule: 'O'
  id: string
}

export interface StackedNode extends FormulaNode {
  forest: [FormulaNode]
}
export interface BranchedNode extends FormulaNode {
  forest: [FormulaNode, FormulaNode]
}

export interface LeafNode extends FormulaNode {
  forest: []
}

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
  | ((
      parentId: string,
      parentRow: number
    ) => [[FormulaNode] | [FormulaNode, FormulaNode], string[]])
  | ((
      parentId: string,
      parentRow: number
    ) => [[FormulaNode, FormulaNode], string[]])

export type NodeUpdater = (node: FormulaNode) => FormulaNode

export type ContradictionLeafNode = FormulaNode & { forest: ContradictionNode }

export type FinishedLeafNode = FormulaNode & { forest: FinishingNode }

export type ClosedLeafNode = ContradictionLeafNode | FinishedLeafNode
