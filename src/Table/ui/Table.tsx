import React, { useMemo, useRef } from 'react';
import clsx from 'clsx';
import {
  useTable,
  useBlockLayout,
  useResizeColumns,
  useSortBy,
  Row as TableRow,
  Cell as TableCell,
  Column,
  HeaderGroup,
} from 'react-table';

import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Cell from '../cells/Cell';
import Header from './Header';
import { TableAction } from '../types/types';

interface RowProps {
  row: TableRow<any>;
  index: number;
  prepareRow: (row: TableRow<any>) => void;
  moveRow: (dragIndex: number, hoverIndex: number) => void;
  selectedRowIndices?: number[];
}

const defaultColumn = {
  minWidth: 40,
  width: 300,
  maxWidth: 400,
  Cell: Cell,
  Header: Header,
  sortType: 'alphanumericFalsyLast',
};

const Row: React.FC<RowProps> = ({ row, index, prepareRow, moveRow, selectedRowIndices }) => {
  const dropRef = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: 'row',
    item: { type: 'row', index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [index]);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'row',
    hover(item: any, monitor) {
      if (!dropRef.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = dropRef.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveRow(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }), [index]);

  drop(preview(dropRef));
  prepareRow(row);

  const isSelected = selectedRowIndices?.includes(index);

  return (
    <div
      ref={dropRef}
      style={{
        opacity: isDragging ? 0.5 : 1,
        display: 'flex',
        alignItems: 'center',
        backgroundColor: isOver ? '#f0f0f0' : 'transparent',
        transition: 'background-color 0.2s ease',
      }}
      className={clsx('tr', {
        'tr-dragging': isDragging,
        'tr-over': isOver && !isDragging,
        'tr-selected': isSelected,
      })}
      {...row.getRowProps({
        style: {
          ...row.getRowProps().style,
          justifyContent: 'flex-end',
        },
      })}
    >
      {row.cells.map((cell: TableCell<any>, cellIndex: number) => {
        const isHiddenCell = ['checkbox', 'drag-handle', 'plus'].includes(cell.column.dataType);

        return (
          <div
            {...cell.getCellProps()}
            className={clsx('td', { 'hidden-cell': isHiddenCell })}
            key={`cell-${index}-${cellIndex}`}
            ref={cellIndex === 1 ? drag : null}
            style={{
              ...cell.getCellProps().style,
              ...(isHiddenCell && {
                width: 30,
                ...(cell.column.dataType === 'plus' && { marginRight: 8 }),
              }),
            }}
          >
            {cell.render('Cell')}
          </div>
        );
      })}
    </div>
  );
};

interface TableProps {
  columns: Column<any>[];
  data: any[];
  dispatch: React.Dispatch<TableAction>;
  skipReset?: boolean;
  selectedRowIndices?: number[];
}

const Table: React.FC<TableProps> = ({ columns, data, dispatch: dataDispatch, skipReset, selectedRowIndices }) => {
  const sortTypes = useMemo(() => ({
    alphanumericFalsyLast: (rowA: any, rowB: any, columnId: string, desc?: boolean) => {
      if (!rowA.values[columnId] && !rowB.values[columnId]) return 0;
      if (!rowA.values[columnId]) return desc ? -1 : 1;
      if (!rowB.values[columnId]) return desc ? 1 : -1;

      return isNaN(rowA.values[columnId])
        ? rowA.values[columnId].localeCompare(rowB.values[columnId])
        : rowA.values[columnId] - rowB.values[columnId];
    },
  }), []);

  const columnsWithSelection = useMemo(() =>
    columns.map(col => ({
      ...col,
      Cell: (props: any) => <Cell {...props} selectedRowIndices={selectedRowIndices} />,
    })),
    [columns, selectedRowIndices]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns: columnsWithSelection,
      data,
      defaultColumn,
      dataDispatch,
      autoResetSortBy: !skipReset,
      autoResetFilters: !skipReset,
      autoResetRowState: !skipReset,
      sortTypes,
    },
    useBlockLayout,
    useResizeColumns,
    useSortBy
  );

  const moveRow = (dragIndex: number, hoverIndex: number) => {
    const newData = [...data];
    const draggedRow = newData[dragIndex];
    newData.splice(dragIndex, 1);
    newData.splice(hoverIndex, 0, draggedRow);
    dataDispatch({ type: 'update_data', data: newData });
  };

  const isTableResizing = () => headerGroups.some((group: HeaderGroup<any>) =>
    group.headers.some(col => col.isResizing)
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        {...getTableProps()}
        className={clsx('table', isTableResizing() && 'noselect')}
      >
        <div>
          {headerGroups.map((headerGroup, groupIndex) => (
            <div
              {...headerGroup.getHeaderGroupProps()}
              className="tr"
              key={`header-group-${groupIndex}`}
            >
              {headerGroup.headers.map((column, columnIndex) => (
                <div
                  {...column.getHeaderProps()}
                  className={clsx(column.className)}
                  key={`column-${groupIndex}-${columnIndex}`}
                >
                  {column.render('Header')}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div {...getTableBodyProps()} className="rowgroup">
          {rows.map((row, index) => (
            <Row
              key={row.id}
              row={row}
              index={index}
              prepareRow={prepareRow}
              moveRow={moveRow}
              selectedRowIndices={selectedRowIndices}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
};

export default Table;