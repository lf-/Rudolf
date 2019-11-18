import React, { useState, useReducer, FC } from 'react'

import { NodeUpdater, SharedContext, FormulaNode } from '../typings/TreeState'
import { parsePremises, updateNode } from '../util/nodes'
import NodeView from './NodeView'
import PremiseInput from './PremiseInput'
import PremisesSelector from './PremisesSelector'
import { IconButton } from '@material-ui/core'
import { Undo, Redo } from '@material-ui/icons'
import { JSONView } from './JSONView'

const initialPremises = 'P->Q,P,~Q'
const initialTree = parsePremises(initialPremises.split(','), '', 1)

export const initialContext: SharedContext = {
  nodeFormulas: {},
  selectedNodeId: null,
  tree: initialTree,
}

const Context = React.createContext<SharedContext>(initialContext)

export type Action =
  | { type: 'setTree'; payload: (tree: FormulaNode) => FormulaNode }
  | { type: 'selectNode'; payload: string | null }
  | { type: 'updateFormula'; payload: { nodeId: string; label: string } }
  | { type: 'updateRule'; payload: { nodeId: string; rule: string } }

const reducer = (state: SharedContext, action: Action) => {
  switch (action.type) {
    case 'setTree':
      return { ...state, tree: action.payload(state.tree) }
    case 'selectNode':
      return { ...state, selectedNodeId: action.payload }
    default:
      console.error('unexpected action type', action)
      return state
  }
}

const App: FC = (): JSX.Element => {
  const [premises, setPremises] = useState(initialPremises)
  // const [tree, setTree] = useState(initialTree)
  const [nextRow, setRow] = useState(initialPremises.split(',').length + 1)
  const [context, dispatch] = useReducer(reducer, initialContext)

  const { tree } = context

  const incrementRow = () => {
    setRow(nextRow + 1)
  }

  const setTree = (updater: (tree: FormulaNode) => FormulaNode) => {
    dispatch({ type: 'setTree', payload: updater })
  }

  const handleSubmitPremises = (rawInput: string) => {
    setPremises(rawInput)
    const premiseArray = premises.split(',')
    setTree(() => parsePremises(premiseArray, '', 1))
    setRow(premiseArray.length)
  }

  return (
    <main className="App">
      <PremisesSelector onChange={handleSubmitPremises} />
      <PremiseInput
        premises={premises}
        onSubmit={handleSubmitPremises}
        setPremises={setPremises}
      />
      <span className="tree-buttons">
        <IconButton className="undo-button" disabled={true}>
          <Undo />
        </IconButton>
        <IconButton className="redo-button" disabled={true}>
          <Redo />
        </IconButton>
      </span>
      <Context.Provider value={{ ...context }}>
        <NodeView
          dispatch={dispatch}
          node={tree}
          nextRow={nextRow}
          incrementRow={incrementRow}
          updateTree={(node: FormulaNode, updater: NodeUpdater) =>
            setTree(() => updateNode(tree, node, updater))
          }
        />
        <JSONView {...{ tree }} />
      </Context.Provider>
    </main>
  )
}

export default App
