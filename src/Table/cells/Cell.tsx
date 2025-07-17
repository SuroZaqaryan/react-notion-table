import React from 'react';
import { DataTypes } from '../utils/utils';
import PlusCell from './PlusCell';
import TextCell from './TextCell';
import NumberCell from './NumberCell';
import SelectCell from './SelectCell';
import CheckboxCell from './CheckboxCell';
import DragHandleCell from './DragHandleCell';
import { TableRow, TableColumn } from '../types/types';

interface CellProps {
  value: any;
  row: {
    index: number;
    original: TableRow;
  };
  column: {
    id: string;
    dataType: string;
  };
  dataDispatch: React.Dispatch<any>;
  selectedRowIndices?: number[];
  className?: string;
}

export default function Cell({
  value: initialValue,
  row: { index, original },
  column: { id, dataType },
  dataDispatch,
  selectedRowIndices,
}: CellProps) {
  const options = original.options || [];
  const isSelected = selectedRowIndices?.includes(index); // определяем, выбран ли ряд

  function getCellElement() {
    const cellProps = {
      initialValue,
      rowIndex: index,
      columnId: id,
      dataDispatch,
      className: ''
    };

    switch (dataType) {
      case DataTypes.TEXT:
        if (id === 'name') {
          return <SelectCell {...cellProps} options={original.nameOptions || []} />;
        }
        return <TextCell {...cellProps} />;

      case DataTypes.NUMBER:
        return <NumberCell {...cellProps} />;

      case DataTypes.SELECT:
        if (id === 'value' && original.options) {
          return <SelectCell {...cellProps} options={original.options} />;
        }
        return <SelectCell {...cellProps} options={options} />;

      case DataTypes.CHECKBOX:
        return <CheckboxCell {...cellProps} isSelected={isSelected} />;

      case DataTypes.DRAG_HANDLE:
        return <DragHandleCell rowIndex={index} />;

      case DataTypes.PLUS:
        return <PlusCell rowIndex={index} dataDispatch={dataDispatch} />;

      default:
        return <span></span>;
    }
  }

  return getCellElement();
}
