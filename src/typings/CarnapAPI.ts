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

export type OutputNode =
  | OutputFormulaNode
  | OutputContradictionNode
  | OutputFinishedNode

export type OutputFormulaNode = {
  nodeType: 'formulas'
  forest: OutputNode[] | [OutputFinishedNode] | [OutputContradictionNode]
  formulas: TreeForm[]
  rule: string
}

// We mark a branch as closed by adding a special closing node

export type OutputFinishedNode = {
  nodeType: 'finished'
  formulas: []
  rule: string // ['O', ...number[]] // List of resolved rows? on the branch
}

export type OutputContradictionNode = {
  nodeType: 'contradiction'
  formulas: []
  rule: string // ['X', number, number] e.g X
}
