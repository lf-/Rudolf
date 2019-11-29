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
import LineTo from 'react-lineto'

import { TreeNode, ClosingNode, TreeForm } from '../typings/Trees'
import { NodeMenu } from './NodeMenu'
import { Context } from './initialState'
import { isClosingNode, isStackedNode, nodeHasChildren } from '../util/nodes'
import { actions, CustomDispatch } from './reducer'
import { FormulaView } from './FormulaView'

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
  const {
    selectedNodeId,
    nodeFormulas,
    nodeRules,
    nextRow,
    firstRow,
    lastRow,
  } = useContext(Context)

  const handleFormulaChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    dispatch(actions.updateFormula(id, event.currentTarget.value))
  }

  const handleContextMenu: MouseEventHandler = (event) => {
    event.preventDefault()
    setMenuOpen(true)
  }

  const handleRuleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    dispatch(actions.updateRule(id, event.currentTarget.value))
  }

  const renderMenu = () => (
    <NodeMenu
      dispatch={dispatch}
      open={menuOpen}
      node={node}
      onClose={() => setMenuOpen(false)}
      anchorEl={nodeRef.current as Element}
    />
  )

  const getClosedMarker = (node: ClosingNode) => {
    return (
      <div
        className={`closed-branch-marker-${node.rule}`}
        onContextMenu={handleContextMenu}
        ref={nodeRef}
      >
        {node.rule}
      </div>
    )
  }

  if (isClosingNode(node)) {
    return (
      <Fragment>
        {getClosedMarker(node)}
        {renderMenu()}
      </Fragment>
    )
  }

  const { id } = node

  const formulas = nodeFormulas[id] ?? ['']
  const rule = nodeRules[id] ?? ''

  return (
    <div
      className={`node-container ${selectedNodeId === id ? 'selected' : ''}`}
    >
      {nodeFormulas[id].map((formula: TreeForm, idx: number) => (
        <FormulaView
          key={id + idx.toString()}
          {...{
            id,
            selectedNodeId,
            handleContextMenu,
            nodeRef,
            formula,
            handleFormulaChange,
            formulas,
            handleRuleChange,
            rule,
          }}
        />
      ))}
      {!isClosingNode(node) &&
        nodeHasChildren(node) &&
        (isStackedNode(node) ? (
          <div className="children stack">
            <Spacers diff={firstRow(node.forest[0]) - lastRow(node)} />
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
      {renderMenu()}
    </div>
  )
}

export default NodeView
