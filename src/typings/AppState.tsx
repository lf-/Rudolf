import { FormulaNode } from './Trees'
import { Dispatch } from 'react'

export type Action =
  | { type: 'setTree'; payload: (tree: FormulaNode) => FormulaNode }
  | { type: 'selectNode'; payload: string | null }
  | { type: 'updateFormula'; payload: { nodeId: string; label: string } }
  | { type: 'updateRule'; payload: { nodeId: string; rule: string } }
  | { type: 'initializeNodes'; payload: string[] }

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
  dispatch: Dispatch<Action>
}
