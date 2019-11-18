import React, { FC } from 'react'
import { TextareaAutosize } from '@material-ui/core'
import { FormulaNode } from '../typings/TreeState'
import { OutputFormulaNode } from '../typings/CarnapAPI'
import {
  isContradictionLeaf,
  isFinishedLeaf,
  nodeHasChildren,
} from '../util/nodes'

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
  return { ...tree, formulas: [], nodeType: 'formulas' }
}

const transformTree = <T extends FormulaNode>(
  tree: FormulaNode
): OutputFormulaNode => {
  if (isContradictionLeaf(tree))
    return {
      ...transformNode(tree),
      forest: [
        { rule: 'contradiction', nodeType: 'contradiction', formulas: [] },
      ],
    }
  else if (isFinishedLeaf(tree)) {
    return {
      ...transformNode(tree),
      forest: [
        {
          rule: 'finished',
          nodeType: 'finished' as const,
          formulas: [],
        },
      ],
    }
  } else if (nodeHasChildren(tree)) {
    return {
      ...transformNode(tree),
      forest: tree.forest.map(transformTree),
    }
  } else {
    return { ...transformNode(tree), forest: [] }
  }
}
