import React, { FC } from 'react'
import { TreeForm } from '../typings/Trees'
import AutoSizeInput from 'react-input-autosize'
import { Check } from '@material-ui/icons'
interface FormulaViewProps {
  id: string
  selectedNodeId: string | null
  handleContextMenu: (event: React.MouseEvent<Element, MouseEvent>) => void
  nodeRef: React.RefObject<HTMLDivElement>
  handleFormulaChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  formula: TreeForm
  handleRuleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  rule: string
}

export const FormulaView: FC<FormulaViewProps> = ({
  id,
  selectedNodeId,
  handleContextMenu,
  nodeRef,
  formula,
  handleFormulaChange,
  handleRuleChange,
  rule,
}) => {
  return (
    <div
      className={`node node-id=${id} ${
        selectedNodeId === id ? 'selected' : ''
      } `}
      onContextMenu={handleContextMenu}
      ref={nodeRef}
    >
      <span>{formula.row} .</span>
      <input
        className="formula"
        onChange={handleFormulaChange}
        value={formula.value}
        placeholder="formula"
      />
      (
      <AutoSizeInput
        className="rule"
        onChange={handleRuleChange}
        value={rule}
        placeholder="rule"
      />
      ){formula.resolved ? <Check /> : ''}
    </div>
  )
}
