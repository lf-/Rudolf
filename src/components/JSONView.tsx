import React, { FC } from 'react'
import { TextareaAutosize } from '@material-ui/core'
import { FormulaNode } from '../typings/CarnapAPI'

export const JSONView: FC<{ tree: FormulaNode }> = ({ tree }) => (
  <TextareaAutosize
    className="json-view"
    value={JSON.stringify(tree, null, '\t')}
  />
)
