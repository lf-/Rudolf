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
} from 'react'
import AutoSizeInput from 'react-input-autosize'
import LineTo from 'react-lineto'

import { TreeNode, ClosingNode } from '../typings/Trees'
import { NodeMenu } from './NodeMenu'
import { Context } from './initialState'
import {
  isClosingNode,
  isStackedNode,
  nodeHasChildren,
  isContradictionNode,
} from '../util/nodes'
import { actions, CustomDispatch } from './reducer'

type Props = {
  node: TreeNode
  dispatch: CustomDispatch
}

const Spacers = ({ diff }: { diff: number }) => {
  const spacers: JSX.Element[] = []
  const i = diff - 1
  while (spacers.length < i) {
    spacers.push(<div className="spacer" />)
  }

  return <>{spacers}</>
}

const NodeView: FC<Props> = ({ node, dispatch }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const nodeRef: Ref<HTMLDivElement> = useRef(null)
  const { selectedNodeId, nodeFormulas, nodeRules, nextRow } = useContext(
    Context
  )

  const handleLabelChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    dispatch(actions.updateFormula(id, event.currentTarget.value))
  }

  const handleContextMenu: MouseEventHandler = (event) => {
    event.preventDefault()
    setMenuOpen(true)
  }

  const handleRuleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    dispatch(actions.updateRule(id, event.currentTarget.value))
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

  const label = nodeFormulas[id] ?? ''
  const rule = nodeRules[id] ?? ''

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
                nextRow,
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
                      nextRow,
                    }}
                  />
                </Fragment>
              )
            })}
          </div>
        ))}
      <NodeMenu
        dispatch={dispatch}
        open={menuOpen}
        node={node}
        onClose={() => setMenuOpen(false)}
        anchorEl={nodeRef.current as Element}
      />
    </div>
  )
}

export default NodeView
