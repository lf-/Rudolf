import {
  Actions,
  createActionCreators,
  createReducerFunction,
  ImmerReducer,
} from 'immer-reducer'
import { Dispatch } from 'react'
import {
  mutateNode,
  parsePremises,
  destructivelyAppendChildren,
  makeNode,
  makeEmptyFormulas,
  makeContradictionNode,
  makeFinishedNode,
  getNode,
} from './util/nodes'
import { FormulaNode } from './typings/CarnapAPI'

export type RudolfStore = {
  tree: FormulaNode
  nextRow: number
}

export class RudolfReducer extends ImmerReducer<RudolfStore> {
  updateFormula(nodeId: string, formulaIndex: number, newValue: string) {
    const draftNode = getNode(this.draftState.tree, nodeId)
    draftNode.formulas[formulaIndex].value = newValue
  }

  updateRule(nodeId: string, newValue: string) {
    const draftNode = getNode(this.draftState.tree, nodeId)
    draftNode.rule = newValue
  }

  toggleResolved(nodeId: string, index: number) {
    const draftNode = getNode(this.draftState.tree, nodeId)
    draftNode.formulas[index].resolved = !draftNode.formulas[index].resolved
  }

  createTree(premiseArray: string[]) {
    this.draftState.tree = parsePremises(premiseArray, '', 1)
    this.draftState.nextRow = premiseArray.length
  }

  continueBranch(nodeId: string, formulaCount: number) {
    const draftNode = getNode(this.draftState.tree, nodeId)
    destructivelyAppendChildren(draftNode, (id) => [
      makeNode({
        id: `${id}0`,
        row: this.draftState.nextRow,
        formulas: makeEmptyFormulas(formulaCount, this.draftState.nextRow),
      }),
    ])

    this.draftState.nextRow += formulaCount
  }

  splitBranch(nodeId: string, formulaCount: number) {
    const draftNode = getNode(this.draftState.tree, nodeId)
    destructivelyAppendChildren(draftNode, (id) => {
      return [
        makeNode({
          id: `${id}0`,
          row: this.draftState.nextRow,
          formulas: makeEmptyFormulas(formulaCount, this.draftState.nextRow),
        }),
        makeNode({
          id: `${id}1`,
          row: this.draftState.nextRow,
          formulas: makeEmptyFormulas(formulaCount, this.draftState.nextRow),
        }),
      ]
    })
    this.draftState.nextRow += formulaCount
  }

  markContradiction(nodeId: string) {
    mutateNode(this.draftState.tree, nodeId, (node: FormulaNode): void => {
      node.forest = [makeContradictionNode(node.id)]
    })
  }

  markFinished(nodeId: string) {
    mutateNode(this.draftState.tree, nodeId, (node: FormulaNode): void => {
      node.forest = [makeFinishedNode(node.id)]
    })
  }

  reopenBranch(nodeId: string) {
    mutateNode(this.draftState.tree, nodeId, (node: FormulaNode) => {
      node.forest = []
    })
  }
}

export const initialPremises = 'P->Q,P,~Q'
const premiseArray = initialPremises.split(',')

export const initialState: RudolfStore = {
  tree: parsePremises(premiseArray, '', 1),
  nextRow: premiseArray.length + 1,
}

export const rudolfReducer = createReducerFunction(RudolfReducer)
export const {
  createTree,
  toggleResolved,
  updateFormula,
  updateRule,
  continueBranch,
  splitBranch,
  markContradiction,
  markFinished,
  reopenBranch,
} = createActionCreators(RudolfReducer)
export type RudolfAction = Actions<typeof RudolfReducer>
export type CustomDispatch = Dispatch<RudolfAction>
