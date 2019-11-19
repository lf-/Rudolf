import { Formula, Rule, FormulaNode } from './Trees'
import { Dispatch } from 'react'

export type Action =
  | { type: 'setTree'; payload: (tree: FormulaNode) => FormulaNode }
  | { type: 'selectNode'; payload: string | null }
  | { type: 'updateFormula'; payload: { nodeId: string; label: string } }
  | { type: 'updateRule'; payload: { nodeId: string; rule: string } }
  | { type: 'initializeNodes'; payload: string[] }

export type NodeFormulaMap = {
  [id: string]: [Formula, Rule]
}

export interface SharedContext {
  selectedNodeId: string | null
  nodeFormulas: NodeFormulaMap
  tree: FormulaNode
  dispatch: Dispatch<Action>
}
