import React from 'react'
import { printTerm } from './typings/Term'
import { TreeNode } from './typings/TruthTree'

type Props = {
  root: TreeNode
}

export default function NodeView({ root }: Props) {
  return <div>{printTerm(root.term)}</div>
}
