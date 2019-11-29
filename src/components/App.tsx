import { IconButton } from '@material-ui/core'
import { Redo, Undo } from '@material-ui/icons'
import React, { FC, useReducer, useState } from 'react'

import { FormulaNode } from '../typings/Trees'
import { Context, initialPremises, initialState } from './initialState'
import { JSONView } from './JSONView'
import NodeView from './NodeView'
import PremiseInput from './PremiseInput'
import PremisesSelector from './PremisesSelector'
import { actions, reducer } from './reducer'

const App: FC = () => {
  const [premises, setPremises] = useState(initialPremises)
  const [appState, dispatch] = useReducer(reducer, initialState)
  const { tree } = appState

  const setTree = (updater: (tree: FormulaNode) => FormulaNode) => {
    dispatch(actions.updateTree(updater))
  }

  const handleSubmitPremises = (rawInput: string) => {
    setPremises(rawInput)
    const premiseArray = premises.split(',')
    // setTree(() => parsePremises(premiseArray, '', 1))
    dispatch(actions.setRow(premiseArray.length + 1))
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
        <NodeView dispatch={dispatch} node={tree} />
        <JSONView {...{ tree }} />
      </Context.Provider>
    </main>
  )
}

export default App
