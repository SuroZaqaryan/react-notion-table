import React from 'react';
import { Checkbox } from 'antd';

interface CheckboxCellProps {
  rowIndex: number;
  dataDispatch: React.Dispatch<{ type: 'toggle_row_selection'; rowIndex: number }>;
  isSelected: boolean | undefined;
}

export default function CheckboxCell({ rowIndex, dataDispatch, isSelected }: CheckboxCellProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        cursor: 'pointer',
      }}
    >
      <Checkbox
        checked={isSelected}
        onChange={() => {
          dataDispatch({
            type: 'toggle_row_selection',
            rowIndex,
          });
        }}
      />
    </div>
  );
}
