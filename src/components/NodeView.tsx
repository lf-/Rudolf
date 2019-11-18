import Check from '@material-ui/icons/Check'
import React, {
  ChangeEventHandler,
  FC,
  Fragment,
  MouseEventHandler,
  Ref,
  useRef,
  useState,
  useContext,
  Dispatch,
} from 'react'
import AutoSizeInput from 'react-input-autosize'
import LineTo from 'react-lineto'

import {
  NodeUpdater,
  TreeNode,
  ClosingNode,
  FormulaNode,
} from '../typings/TreeState'
import { NodeMenu } from './NodeMenu'
import { Action } from './App'
import { initialContext } from './initialState'
import {
  isClosingNode,
  isStackedNode,
  nodeHasChildren,
  isContradictionNode,
} from '../util/nodes'

type Props = {
  node: TreeNode
  updateTree: (node: FormulaNode, updater: NodeUpdater) => void
  nextRow: number
  incrementRow: () => void
  dispatch: Dispatch<Action>
}

const Spacers = ({ diff }: { diff: number }) => {
  const spacers: JSX.Element[] = []
  const i = diff - 1
  while (spacers.length < i) {
    spacers.push(<div className="spacer" />)
  }

  return <>{spacers}</>
}

const context = React.createContext(initialContext)

const NodeView: FC<Props> = ({
  node,
  updateTree,
  nextRow,
  incrementRow,
  dispatch,
}) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const nodeRef: Ref<HTMLDivElement> = useRef(null)
  const { selectedNodeId, nodeFormulas } = useContext(context)

  const handleLabelChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    // onChange({
    //   node,
    //   label: event.currentTarget.value,
    //   rule: rule,
    // })
    dispatch({
      type: 'updateFormula',
      payload: { nodeId: id, label: event.currentTarget.value },
    })
  }

  const handleContextMenu: MouseEventHandler = (event) => {
    event.preventDefault()
    setMenuOpen(true)
  }

  const handleRuleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    // onChange({
    //   node,
    //   label: label,
    //   rule: event.currentTarget.value,
    // })
    dispatch({
      type: 'updateRule',
      payload: { nodeId: id, rule: event.currentTarget.value },
    })
  }

  const getClosedMarker = (node: ClosingNode) => {
    return isContradictionNode(node) ? (
      <div className="closed-branch-marker contradiction ">X</div>
    ) : (
      <div className="closed-branch-marker finished">O</div>
    )
  }

  if (isClosingNode(node)) {
    return getClosedMarker(node)
  }

  const { id } = node

  const [label, rule] = nodeFormulas[id]

  return (
    <div
      className={`node-container ${selectedNodeId === id ? 'selected' : ''}`}
    >
      <div
        className={`node node-id=${id} ${
          selectedNodeId === id ? 'selected' : ''
        } `}
        onContextMenu={handleContextMenu}
        ref={nodeRef}
      >
        <span>{node.row} .</span>
        <input
          className="label"
          onChange={handleLabelChange}
          value={label}
          placeholder="formula"
        />
        (
        <AutoSizeInput
          className="rule"
          onChange={handleRuleChange}
          value={rule}
          placeholder="rule"
        />
        ){node.resolved ? <Check /> : ''}
      </div>

      {!isClosingNode(node) &&
        nodeHasChildren(node) &&
        (isStackedNode(node) ? (
          <div className="children stack">
            <Spacers diff={node.forest[0].row - node.row} />
            <NodeView
              {...{
                node: node.forest[0],
                dispatch,
                selectedNodeId,
                updateTree,
                nextRow,
                incrementRow,
              }}
            />
          </div>
        ) : (
          <div className="children split">
            {node.forest.map((child) => {
              return (
                <Fragment key={child.id}>
                  <Spacers diff={child.row - node.row} />
                  <LineTo
                    from={`node-id=${node.id}`}
                    to={`node-id=${child.id}`}
                    borderColor="black"
                    fromAnchor="bottom"
                    toAnchor="top"
                    delay={0}
                  />
                  <NodeView
                    {...{
                      dispatch,
                      node: child,
                      updateTree,
                      nextRow,
                      incrementRow,
                    }}
                  />
                </Fragment>
              )
            })}
          </div>
        ))}
      <NodeMenu
        open={menuOpen}
        node={node}
        onClose={() => setMenuOpen(false)}
        updateTree={updateTree}
        anchorEl={nodeRef.current as Element}
        nextRow={nextRow}
        incrementRow={incrementRow}
      />
    </div>
  )
}

export default NodeView
