import { SharedContext } from '../typings/SharedContext'
import { parsePremises } from '../util/nodes'
import { createContext } from 'react'

export const initialPremises = 'P->Q,P,~Q'

const initialTree = parsePremises(initialPremises.split(','), '', 1)

export const initialContext: SharedContext = {
  nodeFormulas: {},
  selectedNodeId: null,
  tree: initialTree,
}

export const Context = createContext<SharedContext>(initialContext)
