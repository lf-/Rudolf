import React, { FC } from 'react'
import { TextareaAutosize } from '@material-ui/core'
import { FormulaNode, TreeNode } from '../typings/Trees'
import { OutputFormulaNode, OutputNode } from '../typings/CarnapAPI'
import { nodeHasChildren, isClosingNode } from '../util/nodes'

export const JSONView: FC<{ tree: FormulaNode }> = ({ tree }) => (
  <TextareaAutosize
    className="json-view"
    value={JSON.stringify(transformTree(tree), null, '\t')}
  />
)

const transformNode = ({
  forest: _,
  ...tree
}: FormulaNode): Omit<OutputFormulaNode, 'forest'> => {
  return { ...tree, formulas: [], rule: tree.rule }
}

const transformTree = <T extends FormulaNode>(node: TreeNode): OutputNode => {
  if (isClosingNode(node)) {
    return { ...node, formulas: [] }
  } else if (nodeHasChildren(node)) {
    return {
      ...transformNode(node),
      forest: node.forest.map(transformTree),
    }
  } else {
    return { ...transformNode(node), forest: [] }
  }
}
