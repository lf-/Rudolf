import {
  Actions,
  createActionCreators,
  createReducerFunction,
  ImmerReducer,
} from 'immer-reducer'

import { SharedContext } from '../typings/AppState'
import { NodeUpdater } from '../typings/Trees'
import { Dispatch } from 'react'
import { updateNode } from '../util/nodes'

export class RudolfReducer extends ImmerReducer<SharedContext> {
  updateTree(updater: NodeUpdater) {
    this.draftState.tree = updater(this.draftState.tree)
  }

  updateAtNode(id: string, updater: NodeUpdater) {
    this.draftState.tree = updateNode(this.draftState.tree, id, updater)
  }

  selectNode(id: string | null) {
    this.draftState.selectedNodeId = id
  }

  initializeNodes(ids: string[]) {
    for (const id of ids) {
      this.draftState.nodeFormulas[id] = ''
    }
  }

  updateFormula(id: string, formula: string) {
    this.draftState.nodeFormulas[id] = formula
  }

  updateRule(id: string, rule: string) {
    this.draftState.nodeRules[id] = rule
  }

  incrementRow() {
    this.draftState.nextRow += 1
  }

  setRow(row: number) {
    this.draftState.nextRow = row
  }
}

export const reducer = createReducerFunction(RudolfReducer)
export const actions = createActionCreators(RudolfReducer)
export type RudolfAction = Actions<typeof RudolfReducer>
export type CustomDispatch = Dispatch<RudolfAction>
