import { TreeNodeProps, TreeNode } from './TreeState'

export interface FeedbackMessage {
  status: 'correct' | 'incorrect' | 'parsing'
  message: string
}

export interface FeedbackNode {
  feedback: FeedbackMessage[]
  forest: FeedbackNode[]
}

export interface TreeForm {
  resolved: boolean
  row: number
  value: string
}

export type OutputNode = FormulaNode | ContradictionNode | FinishedNode

export interface FormulaNode extends TreeNodeProps {
  nodeType: 'formulas'
  forest: TreeNode[]
  formulas: TreeForm[]
  rule: string
}

// We mark a branch as closed by adding a special node

export interface FinishedNode extends TreeNodeProps {
  nodeType: 'finished'
  formulas: []
  rule: string // ['O', ...number[]] // List of resolved rows? on the branch
}

export interface ContradictionNode extends TreeNodeProps {
  nodeType: 'contradiction'
  formulas: []
  rule: string // ['X', number, number] e.g X
}
