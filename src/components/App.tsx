import React, { useState } from 'react'

import { NodeUpdater, TreeNode } from '../typings/TreeState'
import { parsePremises, updateNode } from '../util/nodes'
import NodeView from './NodeView'
import PremiseInput from './PremiseInput'
import PremisesSelector from './PremisesSelector'
import { IconButton } from '@material-ui/core'
import { Undo, Redo } from '@material-ui/icons'
import { JSONView } from './JSONView'

const initialPremises = 'P->Q,P,~Q'
const initialTree = parsePremises(initialPremises.split(','), '', 1)

const initialState = { selectedNode: null }

const TreeContext = React.createContext<{
  // nodeFormulas: { [id: string]: string }
  selectedNode: string | null
}>(initialState)

const App: React.FC = (): JSX.Element => {
  const [selectedNode, selectNode] = useState<string | null>(null)
  const [premises, setPremises] = useState(initialPremises)
  const [tree, setTree] = useState(initialTree)
  const [nextRow, setRow] = useState(initialPremises.split(',').length + 1)

  const incrementRow = () => {
    setRow(nextRow + 1)
  }

  const handleNodeChange = ({
    node,
    label,
    rule,
  }: {
    node: TreeNode
    label: string
    rule: string
  }) => {
    setTree((oldTree) =>
      updateNode(oldTree, node, (oldSubTree) => ({
        ...oldSubTree,
        label,
        rule,
      }))
    )
  }

  const handleSubmitPremises = (rawInput: string) => {
    setPremises(rawInput)
    const premiseArray = premises.split(',')
    setTree(parsePremises(premiseArray, '', 1))
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
      <TreeContext.Provider value={{ selectedNode }}>
        <NodeView
          selectNode={selectNode}
          node={tree}
          nextRow={nextRow}
          incrementRow={incrementRow}
          onChange={handleNodeChange}
          updateTree={(node: TreeNode, updater: NodeUpdater) =>
            setTree(updateNode(tree, node, updater))
          }
        />
        <JSONView {...{ tree }} />
      </TreeContext.Provider>
    </main>
  )
}

export default App
