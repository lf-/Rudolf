import { Menu, MenuItem } from '@material-ui/core'
import React, { FC, useContext } from 'react'

import { NodeUpdater, TreeNode } from '../typings/Trees'
import {
  appendChildren,
  isFormulaNode,
  isOpenLeaf,
  makeContradictionNode,
  makeFinishedNode,
  makeNode,
  isClosingNode,
} from '../util/nodes'
import { actions, CustomDispatch } from './reducer'
import { Context } from './initialState'

type Props = {
  node: TreeNode
  onClose: () => void
  open: boolean
  anchorEl: Element
  dispatch: CustomDispatch
}

export const NodeMenu: FC<Props> = ({
  open,
  node,
  anchorEl,
  onClose: close,
  dispatch,
}) => {
  const { nextRow } = useContext(Context)

  const update = (updater: NodeUpdater) => {
    isFormulaNode(node) && dispatch(actions.updateAtNode(node.id, updater))
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
    dispatch(actions.incrementRow())
    update(splitBranchUpdater)
  }

  const handleContinue = (): void => {
    dispatch(actions.incrementRow())
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
      forest: [makeContradictionNode(node.id)],
    }))

  const markFinished = (): void =>
    update((node) => ({
      ...node,
      forest: [makeFinishedNode(node.id)],
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
      {isClosingNode(node) && (
        <MenuItem onClick={reopenBranch}>Reopen Branch</MenuItem>
      )}
    </Menu>
  )
}
