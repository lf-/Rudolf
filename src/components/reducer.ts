import { Action, SharedContext } from '../typings/AppState'
import { produce } from 'immer'
export const reducer = (state: SharedContext, action: Action) => {
  switch (action.type) {
    case 'setTree':
      return { ...state, tree: action.payload(state.tree) }
    case 'selectNode':
      return { ...state, selectedNodeId: action.payload }
    case 'initializeNodes':
      return produce(state, (draft) => {
        for (const id of action.payload) {
          draft.nodeFormulas[id] = ['', '']
        }
      })
    case 'updateRule': {
      return produce(state, (draft) => {
        const { nodeId, rule } = action.payload
        draft.nodeFormulas[nodeId][1] = rule
      })
    }
    case 'updateFormula': {
      return produce(state, (draft) => {
        const { nodeId, label } = action.payload
        draft.nodeFormulas[nodeId][0] = label
      })
    }
    default:
      console.error('unexpected action type', action)
      return state
  }
}
// export class MyReducer extends ImmerReducer<SharedContext> {
//     setTree(tree: string) {

//     }
// }
