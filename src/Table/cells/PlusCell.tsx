import React from 'react';
import { Plus } from 'lucide-react';
import { TableAction } from '../types/types';

interface PlusCellProps {
  rowIndex: number;
  dataDispatch: React.Dispatch<TableAction>
}

export default function PlusCell({ rowIndex, dataDispatch }: PlusCellProps) {
  return (
    <span
      className="svg-icon svg-gray icon-margin"
      onClick={(e) => {
        e.stopPropagation();
        dataDispatch({
          type: 'INSERT_ROW',
          index: rowIndex + 1,
          triggeredFromRow: rowIndex,
        });
      }}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer'
      }}
    >
      <Plus style={{ top: 0 }} size={15} />
    </span>
  );
}
