/**
 *  @TODO
 * 1. group formulas on single node in array.
 * 2. make closed nodes work more like output
 * 3. extract formula values to map
 *  */
export interface TreeNode {
  label: string
  // formulas: TreeForm[]
  forest: TreeNode[] | 'finished' | 'contradiction'
  resolved: boolean
  rule: string
  id: string
  row: number
}

type Formula = string
type Rule = string

export interface SharedContext {
  selectedNodeId: string | null
  nodeFormulas: { [id: string]: [Formula, Rule] }
  tree: TreeNode
}

// export interface TreeForm {
//   value: string
//   resolved: boolean
//   row: number
// }

export type NodeGenerator = (parentId: string, parentRow: number) => TreeNode[]

export type NodeUpdater = (node: TreeNode) => TreeNode

export type OpenLeafNode = TreeNode & { forest: [] }

export type ClosedLeafNode = TreeNode & { forest: 'contradiction' }

export type FinishedLeafNode = TreeNode & { forest: 'finished' }
