import { CustomDispatch } from '../components/reducer'
import { FormulaNode } from './Trees'

export type NodeFormulaMap = {
  [id: string]: string
}
export type NodeRuleMap = {
  [id: string]: string
}

export interface SharedContext {
  selectedNodeId: string | null
  nodeFormulas: NodeFormulaMap
  nodeRules: NodeRuleMap
  tree: FormulaNode
}

export interface ContextWithDispatch {
  dispatch: CustomDispatch
}
