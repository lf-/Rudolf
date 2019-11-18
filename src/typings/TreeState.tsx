/**
 *  @TODO
 * 1. group formulas on single node in array.
 * 2. make closed nodes work more like output
 * 3. extract formula values to map
 *  */
export interface TreeNode {
  label: string
  forest: [] | [TreeNode] | [TreeNode, TreeNode] | ClosingNode | FinishingNode
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

export type ClosedLeafNode = TreeNode & { forest: ContradictionNode }

export type FinishedLeafNode = TreeNode & { forest: FinishingNode }

export type ContradictionNode = 'contradiction'
export type FinishingNode = 'finished'
export type ClosingNode = ContradictionNode | FinishingNode

export type BranchedNode = TreeNode & { forest: [TreeNode, TreeNode] }

export type StackedNode = TreeNode & { forest: [TreeNode] }
