import React, { useMemo } from 'react';
import clsx from 'clsx';
import {
  useTable,
  useBlockLayout,
  useResizeColumns,
  useSortBy,
} from 'react-table';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Cell from './cells/Cell';
import Header from './header/Header';

const defaultColumn = {
  minWidth: 40,
  width: 200,
  maxWidth: 400,
  Cell: Cell,
  Header: Header,
  sortType: 'alphanumericFalsyLast',
};

const Row = ({ row, index, prepareRow, moveRow }) => {
  const dropRef = React.useRef(null);
  const dragRef = React.useRef(null);

  const [{ isDragging }, drag, preview] = useDrag({
    type: 'row',
    item: { type: 'row', index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const [{ isOver }, drop] = useDrop({
    accept: 'row',
    hover(item, monitor) {
      if (!dropRef.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = dropRef.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveRow(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  });

  drop(preview(dropRef));

  prepareRow(row);

  return (
    <div
      ref={dropRef}
      style={{
        opacity: isDragging ? 0.5 : 1,
        display: 'flex',
        alignItems: 'center',
        backgroundColor: isOver ? '#f0f0f0' : 'transparent',
        transition: 'background-color 0.2s ease'
      }}
      className={clsx('tr', {
        'tr-dragging': isDragging,
        'tr-over': isOver && !isDragging,
      })}
      {...row.getRowProps({
        style: {
          ...row.getRowProps().style,
          justifyContent: "flex-end",
        },
      })}
    >
      {row.cells.map((cell, cellIndex) => {
        // нужно ли скрывать эти ячейки
        const isHiddenCell = ['checkbox', 'drag-handle', 'plus'].includes(cell.column.dataType);

        return (
          <div
            {...cell.getCellProps()}
            className={clsx('td', { 'hidden-cell': isHiddenCell, })}
            key={`cell-${index}-${cellIndex}`}
            ref={cellIndex === 1 ? drag : null}
            style={{
              ...cell.getCellProps().style,
              ...(isHiddenCell && 
                { 
                  width: 30,
                  ...(cell.column.dataType === 'plus' && { marginRight: 8 })
                 }
              )
            }}
          >
            {cell.render('Cell')}
          </div>
        );
      })}
    </div>
  );
};

function Table({ columns, data, dispatch: dataDispatch, skipReset }) {
  const sortTypes = useMemo(
    () => ({
      alphanumericFalsyLast(rowA, rowB, columnId, desc) {
        if (!rowA.values[columnId] && !rowB.values[columnId]) {
          return 0;
        }

        if (!rowA.values[columnId]) {
          return desc ? -1 : 1;
        }

        if (!rowB.values[columnId]) {
          return desc ? 1 : -1;
        }

        return isNaN(rowA.values[columnId])
          ? rowA.values[columnId].localeCompare(rowB.values[columnId])
          : rowA.values[columnId] - rowB.values[columnId];
      },
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    totalColumnsWidth,
  } = useTable(
    {
      columns,
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

  const moveRow = (dragIndex, hoverIndex) => {
    const newData = [...data];
    const draggedRow = newData[dragIndex];
    newData.splice(dragIndex, 1);
    newData.splice(hoverIndex, 0, draggedRow);
    dataDispatch({ type: 'update_data', data: newData });
  };

  function isTableResizing() {
    for (let headerGroup of headerGroups) {
      for (let column of headerGroup.headers) {
        if (column.isResizing) {
          return true;
        }
      }
    }

    return false;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ maxWidth: '100vw', height: '100vh', overflow: 'auto', display: 'flex' }}>
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
                    className={clsx(
                      column.className,
                    )}
                    key={`column-${groupIndex}-${columnIndex}`}
                  >
                    {column.render('Header')}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div {...getTableBodyProps()} className='rowgroup'>
            {rows.map((row, index) => (
              <Row
                key={row.id}
                row={row}
                index={index}
                prepareRow={prepareRow}
                moveRow={moveRow}
              />
            ))}
          </div>
        </div>
      </div>
    </DndProvider>
  );
}

export default Table;