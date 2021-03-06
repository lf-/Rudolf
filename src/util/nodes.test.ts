import { TreeNode } from '../typings/TreeState'
import { findresolvedRows } from './nodes'

describe(findresolvedRows, () => {
  it('works with no resolved formulas on branch', () => {
    const root: TreeNode = {
      nodeType: 'formulas',
      formulas: [
        {
          value: 'P->Q',
          row: 1,
          resolved: false,
        },
        {
          value: 'P',
          row: 2,
          resolved: false,
        },
        {
          value: '~Q',
          row: 3,
          resolved: false,
        },
      ],
      forest: [
        {
          nodeType: 'finished',
          formulas: [],
          rule: 'O()',
          id: '00',
        },
      ],
      rule: 'A',
      id: '0',
    }

    const resolvedRows = findresolvedRows(root, root.id)
    expect(resolvedRows).toEqual([])
  })

  it('works when tree branches', () => {
    const root: TreeNode = {
      nodeType: 'formulas',
      formulas: [
        {
          value: 'P->Q',
          row: 1,
          resolved: false,
        },
        {
          value: 'P',
          row: 2,
          resolved: true,
        },
        {
          value: '~Q',
          row: 3,
          resolved: false,
        },
      ],
      forest: [
        {
          nodeType: 'formulas',
          formulas: [
            {
              value: '~P',
              row: 4,
              resolved: false,
            },
          ],
          forest: [
            {
              nodeType: 'finished',
              formulas: [],
              rule: 'O()',
              id: '000',
            },
          ],
          rule: '-> 1',
          id: '00',
        },
        {
          nodeType: 'formulas',
          formulas: [
            {
              value: 'Q',
              row: 4,
              resolved: false,
            },
          ],
          forest: [],
          rule: '-> 1',
          id: '01',
        },
      ],
      rule: 'A',
      id: '0',
    }
    const resolvedRows = findresolvedRows(root, '01')
    expect(resolvedRows).toEqual([2])
  })

  it('works when tree does not branch', () => {
    const root: TreeNode = {
      nodeType: 'formulas',
      formulas: [
        {
          value: 'P->Q',
          row: 1,
          resolved: true,
        },
        {
          value: 'P',
          row: 2,
          resolved: true,
        },
        {
          value: '~Q',
          row: 3,
          resolved: false,
        },
      ],
      forest: [
        {
          nodeType: 'finished',
          formulas: [],
          rule: 'O()',
          id: '00',
        },
      ],
      rule: 'A',
      id: '0',
    }

    const resolvedRows = findresolvedRows(root, root.id)
    expect(resolvedRows).toEqual([1, 2])
  })

  it('works when tree has more than one node but does not branch', () => {
    const root: TreeNode = {
      nodeType: 'formulas',
      formulas: [
        {
          value: 'P->Q',
          row: 1,
          resolved: false,
        },
        {
          value: 'P',
          row: 2,
          resolved: false,
        },
        {
          value: '~Q',
          row: 3,
          resolved: true,
        },
      ],
      forest: [
        {
          nodeType: 'formulas',
          formulas: [
            {
              value: 'Q',
              row: 4,
              resolved: false,
            },
          ],
          forest: [
            {
              nodeType: 'finished',
              formulas: [],
              rule: 'O()',
              id: '000',
            },
          ],
          rule: '',
          id: '00',
        },
      ],
      rule: 'A',
      id: '0',
    }

    const resolvedRows = findresolvedRows(root, root.id)
    expect(resolvedRows).toEqual([3])
  })
})
