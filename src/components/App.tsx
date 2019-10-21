import React, { useState } from 'react'

import { TreeNode, NodeUpdater } from '../typings/TreeNode'
import { updateNode, parsePremises } from '../util/nodes'
import NodeView from './NodeView'
import PremiseInput from './PremiseInput'
import PremisesSelector from './PremisesSelector'
import { IconButton } from '@material-ui/core'
import { Undo } from '@material-ui/icons'

const defaultPremises = 'P->Q,P,~Q'
const exampleTree: TreeNode = parsePremises(defaultPremises.split(','))

const App: React.FC = (): JSX.Element => {
  const [selectedNode, selectNode] = useState<TreeNode | null>(null)
  const [[tree, history], setTree] = useState<[TreeNode, TreeNode[]]>([
    exampleTree,
    [],
  ])
  const [premises, setPremises] = useState<string>(defaultPremises)

  const handleNodeChange = ({
    node,
    label,
    rule,
  }: {
    node: TreeNode
    label: string
    rule: string
  }) => {
    setTree(([oldTree, history]) => [
      updateNode(oldTree, node, (oldSubTree) => ({
        ...oldSubTree,
        label,
        rule,
      })),
      [oldTree, ...history],
    ])
  }

  const handleSubmitPremises = (premises: string) => {
    setPremises(premises)
    setTree(([oldTree, history]) => [
      parsePremises(premises.split(',')),
      [oldTree, ...history],
    ])
  }

  const undo = () => {
    setTree(([_, [previousTree, ...history]]) => [previousTree, history])
  }

  return (
    <div className="App">
      <main className="App-main">
        <PremisesSelector onChange={handleSubmitPremises} />

        <PremiseInput
          premises={premises}
          onSubmit={handleSubmitPremises}
          setPremises={setPremises}
        />
        <IconButton onClick={undo} disabled={!history.length}>
          <Undo />
        </IconButton>
        <NodeView
          node={tree}
          selectNode={selectNode}
          selectedNode={selectedNode}
          onChange={handleNodeChange}
          updateTree={(node: TreeNode, updater: NodeUpdater) =>
            setTree(([oldTree, history]) => [
              updateNode(tree, node, updater),
              [oldTree, ...history],
            ])
          }
        />
      </main>
    </div>
  )
}

export default App
