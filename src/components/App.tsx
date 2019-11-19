import { IconButton } from '@material-ui/core'
import { Redo, Undo } from '@material-ui/icons'
import React, { FC, useReducer, useState } from 'react'

import { FormulaNode, NodeUpdater } from '../typings/Trees'
import { parsePremises, updateNode } from '../util/nodes'
import { Context, initialPremises, initialState } from './initialState'
import { JSONView } from './JSONView'
import NodeView from './NodeView'
import PremiseInput from './PremiseInput'
import PremisesSelector from './PremisesSelector'
import { reducer, actions } from './reducer'

const App: FC = () => {
  const [premises, setPremises] = useState(initialPremises)
  const [nextRow, setRow] = useState(initialPremises.split(',').length + 1)
  const [appState, dispatch] = useReducer(reducer, initialState)
  const { tree } = appState
  const incrementRow = () => {
    setRow(nextRow + 1)
  }

  const setTree = (updater: (tree: FormulaNode) => FormulaNode) => {
    dispatch(actions.setTree(updater))
  }

  const handleSubmitPremises = (rawInput: string) => {
    setPremises(rawInput)
    const premiseArray = premises.split(',')
    setTree(() => parsePremises(premiseArray, '', 1))
    setRow(premiseArray.length)
  }

  return (
    <main className="App">
      <Context.Provider value={appState}>
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
