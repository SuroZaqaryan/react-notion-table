import { DataTypes } from '../utils/utils';
import PlusCell from './PlusCell';
import TextCell from './TextCell';
import NumberCell from './NumberCell';
import SelectCell from './SelectCell';
import CheckboxCell from './CheckboxCell';
import DragHandleCell from './DragHandleCell';

export default function Cell({
  value: initialValue,
  row: { index, original },
  column: { id, dataType },
  dataDispatch,
  selectedRowIndices,
}) {
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
        return <TextCell {...cellProps} />;
      case DataTypes.NUMBER:
        return <NumberCell {...cellProps} />;
      case DataTypes.SELECT:
        return <SelectCell {...cellProps} options={options} />;
      case DataTypes.CHECKBOX:
        return <CheckboxCell {...cellProps} isSelected={isSelected} className="hidden-cell" />;
      case DataTypes.DRAG_HANDLE:
        return <DragHandleCell rowIndex={index} className="hidden-cell" />;
      case DataTypes.PLUS:
        return <PlusCell rowIndex={index} dataDispatch={dataDispatch} className="hidden-cell" />;
      default:
        return <span></span>;
    }
  }

  return getCellElement();
}