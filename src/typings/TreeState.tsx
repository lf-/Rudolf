import { TreeForm } from './CarnapAPI'

/**
 * TODOS
 * 2. make closed nodes work more like output
 *  */
export interface TreeNode {
  formulas: TreeForm[]
  forest: TreeNode[] | 'finished' | 'contradiction'
  id: string
}

export type NodeGenerator = (parentId: string, parentRow: number) => TreeNode[]

export type NodeUpdater = (node: TreeNode) => TreeNode
export type NodeMutater = (node: TreeNode) => void

export type OpenLeafNode = TreeNode & { forest: [] }

type ContradictionNode = 'contradiction'
export type ClosedLeafNode = TreeNode & { forest: ContradictionNode }

type FinishedNode = 'finished'
export type FinishedLeafNode = TreeNode & { forest: FinishedNode }
