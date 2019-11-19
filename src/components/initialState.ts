import { SharedContext, NodeFormulaMap } from '../typings/AppState'
import { parsePremises, isStackedNode } from '../util/nodes'
import { createContext } from 'react'
import { FormulaNode } from '../typings/Trees'

export const initialPremises = 'P->Q,P,~Q'

const initialTree = parsePremises(initialPremises.split(','), '', 1)

const mapTree = (tree: FormulaNode): NodeFormulaMap => {
  const entry: NodeFormulaMap = {
    [tree.id]: [tree.label, tree.rule],
  }
  if (isStackedNode(tree)) {
    return { ...entry, ...mapTree(tree.forest[0]) }
  } else {
    return entry
  }
}

export const initialState: SharedContext = {
  nodeFormulas: mapTree(initialTree),
  selectedNodeId: null,
  tree: initialTree,
  dispatch: () => {},
}

export const Context = createContext<SharedContext>(initialState)
