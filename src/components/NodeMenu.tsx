import { Menu, MenuItem } from '@material-ui/core'
import React, { FC } from 'react'

import { FormulaNode, NodeUpdater, TreeNode } from '../typings/Trees'
import {
  appendChildren,
  isClosedLeaf,
  isFormulaNode,
  isOpenLeaf,
  makeContradictionNode,
  makeFinishedNode,
  makeNode,
} from '../util/nodes'
import { CustomDispatch, actions } from './reducer'

type Props = {
  node: TreeNode
  onClose: () => void
  updateTree: (node: FormulaNode, updater: NodeUpdater) => void
  open: boolean
  anchorEl: Element
  nextRow: number
  incrementRow: () => void
  dispatch: CustomDispatch
}

export const NodeMenu: FC<Props> = ({
  open,
  node,
  updateTree,
  anchorEl,
  onClose: close,
  nextRow,
  incrementRow,
  dispatch,
}) => {
  const update = (updater: NodeUpdater) => {
    isFormulaNode(node) && updateTree(node, updater)
    close()
  }

  const continueBranchUpdater: NodeUpdater = (node) => {
    const [newNode, ids] = appendChildren(node, (parentId: string) => {
      const id = `${parentId}0`
      const newNode = makeNode({ id, row: nextRow })
      return [[newNode], [id]]
    })
    dispatch(actions.initializeNodes(ids))
    return newNode
  }

  const splitBranchUpdater: NodeUpdater = (node) => {
    const [newNode, ids] = appendChildren(node, (id: string) => {
      const ids = [`${id}0`, `${id}1`]
      return [
        [
          makeNode({
            id: ids[0],
            row: nextRow,
          }),
          makeNode({
            id: ids[1],
            row: nextRow,
          }),
        ],
        ids,
      ]
    })
    dispatch(actions.initializeNodes(ids))
    return newNode
  }

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
        <MenuItem onClick={handleContinue}>Continue Branch</MenuItem>
      )}
      {isFormulaNode(node) && (
        <MenuItem onClick={handleSplit}>Split Branch</MenuItem>
      )}
      {isFormulaNode(node) && (
        <MenuItem onClick={toggleResolved}>
          Mark as {node.resolved ? 'Un' : ''}Resolved
        </MenuItem>
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
