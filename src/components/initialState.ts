import { AppState, NodeFormulaMap, NodeRuleMap } from '../typings/AppState'
import { isStackedNode, makeNode } from '../util/nodes'
import { createContext } from 'react'
import { FormulaNode } from '../typings/Trees'

export const initialPremises = 'P->Q,P,~Q'

const mapTree = <K extends keyof FormulaNode>(
  tree: FormulaNode,
  key: K
): { [id: string]: FormulaNode[K] } => {
  const entry: { [id: string]: FormulaNode[K] } = {
    [tree.id]: tree[key],
  }
  if (isStackedNode(tree)) {
    return { ...entry, ...mapTree(tree.forest[0], key) }
  } else {
    return entry
  }
}

/**
 *
 * @param formulas an array of of formulas.
 */
export const parsePremises = (formulas: string) => {
  const nodeFormulas: NodeFormulaMap = { '0': [] }
  const nodeRules: NodeRuleMap = { '0': 'A' }
  let nextRow = 1
  for (const form of formulas.split(',')) {
    nodeFormulas['0'].push({ value: form, row: nextRow, resolved: false })
    nextRow += 1
  }
  const tree = makeNode({ id: '0' })
  return { tree, nodeFormulas, nodeRules }
}

export const initialState: AppState = {
  ...parsePremises(initialPremises),
  selectedNodeId: null,
  nextRow: initialPremises.split(',').length + 1,
}

export const Context = createContext<AppState>(initialState)
