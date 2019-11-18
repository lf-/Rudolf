import { Formula, Rule, FormulaNode } from './TreeState'
export interface SharedContext {
  selectedNodeId: string | null
  nodeFormulas: {
    [id: string]: [Formula, Rule]
  }
  tree: FormulaNode
}
