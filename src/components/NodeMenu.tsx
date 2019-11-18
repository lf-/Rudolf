import { Menu, MenuItem } from '@material-ui/core'
import React, { FC } from 'react'

import { NodeUpdater, TreeNode, FormulaNode } from '../typings/TreeState'
import {
  appendChildren,
  isOpenLeaf,
  makeNode,
  isClosedLeaf,
  isFormulaNode,
  makeContradictionNode,
  makeFinishedNode,
} from '../util/nodes'

type Props = {
  node: TreeNode
  onClose: () => void
  updateTree: (node: FormulaNode, updater: NodeUpdater) => void
  open: boolean
  anchorEl: Element
  nextRow: number
  incrementRow: () => void
}

export const NodeMenu: FC<Props> = ({
  open,
  node,
  updateTree,
  anchorEl,
  onClose: close,
  nextRow,
  incrementRow,
}) => {
  const update = (updater: NodeUpdater) => {
    isFormulaNode(node) && updateTree(node, updater)
    close()
  }

  const continueBranchUpdater: NodeUpdater = (node) =>
    appendChildren(node, (id) => [makeNode({ id: `${id}0`, row: nextRow })])

  const splitBranchUpdater: NodeUpdater = (node) =>
    appendChildren(node, (id) => [
      makeNode({
        id: `${id}0`,
        row: nextRow,
      }),
      makeNode({
        id: `${id}1`,
        row: nextRow,
      }),
    ])

  const handleSplit = (): void => {
    incrementRow()
    update(splitBranchUpdater)
  }

  const handleContinue = (): void => {
    incrementRow()
    update(continueBranchUpdater)
  }

  const toggleResolved = (): void =>
    update((node) => ({
      ...node,
      resolved: !node.resolved,
    }))

  const markContradiction = (): void =>
    update((node) => ({
      ...node,
      forest: [makeContradictionNode()],
    }))

  const markFinished = (): void =>
    update((node) => ({
      ...node,
      forest: [makeFinishedNode()],
    }))
  const reopenBranch = (): void =>
    update((node) => ({
      ...node,
      forest: [],
    }))

  return (
    <Menu open={open} anchorEl={anchorEl} onClose={close}>
      {isFormulaNode(node) && (
        <>
          <MenuItem onClick={handleContinue}>Continue Branch</MenuItem>
          <MenuItem onClick={handleSplit}>Split Branch</MenuItem>
          <MenuItem onClick={toggleResolved}>
            Mark as {node.resolved ? 'Un' : ''}Resolved
          </MenuItem>
        </>
      )}
      {isOpenLeaf(node) && (
        <MenuItem onClick={markContradiction}>
          Close Branch With Contradiction
        </MenuItem>
      )}
      {isOpenLeaf(node) && (
        <MenuItem onClick={markFinished}>Mark Branch Finished</MenuItem>
      )}
      {isClosedLeaf(node) && (
        <MenuItem onClick={reopenBranch}>Reopen Branch</MenuItem>
      )}
    </Menu>
  )
}
