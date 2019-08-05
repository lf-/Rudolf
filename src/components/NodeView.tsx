import './NodeView.css'

import Check from '@material-ui/icons/Check'
import React from 'react'
import LineTo from 'react-lineto'

import { TreeNode } from '../typings/TreeNode'

type Props = {
  root: TreeNode
  selectedNode: TreeNode | null
  onClick: (_: TreeNode) => void
}
export default function NodeView({ root, selectedNode, onClick }: Props) {
  return (
    <div
      className={`node-container ${selectedNode === root ? 'selected' : ''}`}
    >
      <div
        className={`node ${root ? root.formula : ''} ${selectedNode === root ? 'selected' : ''} `}
        onClick={() => onClick(root)}
      >
        {root.formula}
        {root.resolved ? <Check /> : ''}
        {root.closed && <div className="closed-branch-marker">X</div>}
      </div>
      {root.children.length > 0 &&
        (root.children.length === 1 ? (
          <div className="children stack">
            <NodeView {...{ root: root.children[0], selectedNode, onClick }} />
          </div>
        ) : (
            <div className="children split">
              {root.children.map((child) => (
                <NodeView
                  key={child.formula}
                  {...{
                    root: child,
                    selectedNode,
                    onClick,
                  }}
                />
              ))}
              <LineTo
                from={root.formula}
                to={root.children[0].formula}
                borderColor="white"
                borderWidth="30"
                fromAnchor="bottom"
                toAnchor="top" />
              <LineTo
                from={root.formula}
                to={root.children[1].formula}
                borderColor="white"
                borderWidth="30"
                fromAnchor="bottom"
                toAnchor="top" />
            </div>
          ))}
    </div>
  )
}
