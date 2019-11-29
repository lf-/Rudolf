import { CustomDispatch } from '../components/reducer'
import { FormulaNode, TreeForm } from './Trees'

export type NodeFormulaMap = {
  [id: string]: TreeForm[]
}
export type NodeRuleMap = {
  [id: string]: string
}

export interface AppState {
  selectedNodeId: string | null
  nodeFormulas: NodeFormulaMap
  nodeRules: NodeRuleMap
  tree: FormulaNode
  nextRow: number
  firstRow: (node: FormulaNode) => number
  lastRow: (node: FormulaNode) => number
}

export interface ContextWithDispatch {
  dispatch: CustomDispatch
}
