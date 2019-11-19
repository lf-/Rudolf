import { SharedContext } from '../typings/AppState'
import { parsePremises, isStackedNode } from '../util/nodes'
import { createContext } from 'react'
import { FormulaNode } from '../typings/Trees'

export const initialPremises = 'P->Q,P,~Q'

const initialTree = parsePremises(initialPremises.split(','), '', 1)

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

export const initialState: SharedContext = {
  nodeFormulas: mapTree(initialTree, 'label'),
  nodeRules: mapTree(initialTree, 'rule'),
  selectedNodeId: null,
  tree: initialTree,
  nextRow: initialPremises.split(',').length + 1,
}

export const Context = createContext<SharedContext>(initialState)
