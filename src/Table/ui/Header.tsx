import React, { useState, useEffect, Dispatch } from 'react';
import { usePopper } from 'react-popper';
import { Constants } from '../utils/utils';
import AddColumnHeader from './AddColumnHeader';
import DataTypeIcon from '../lib/DataTypeIcon';
import HeaderMenu from './HeaderMenu';
import { TableAction } from '../types/types';

interface Column {
  id: string | number;
  created?: boolean;
  label: string;
  dataType: string;
  getResizerProps?: () => React.HTMLAttributes<HTMLDivElement>;
  getHeaderProps: () => React.HTMLAttributes<HTMLDivElement>;
}

interface HeaderProps {
  column: Column;
  setSortBy: (sortBy: { id: string | number; desc?: boolean }[]) => void;
  dataDispatch: Dispatch<TableAction>;
}

export default function Header({ column, setSortBy, dataDispatch }: HeaderProps) {
  const { id, created, label, dataType, getResizerProps, getHeaderProps } = column;

  const [showHeaderMenu, setShowHeaderMenu] = useState<boolean>(created || false);
  const [headerMenuAnchorRef, setHeaderMenuAnchorRef] = useState<HTMLElement | null>(null);
  const [headerMenuPopperRef, setHeaderMenuPopperRef] = useState<HTMLElement | null>(null);

  const headerMenuPopper = usePopper(headerMenuAnchorRef, headerMenuPopperRef, {
    placement: 'bottom',
    strategy: 'absolute',
  });

  useEffect(() => {
    if (created) {
      setShowHeaderMenu(true);
    }
  }, [created]);

  function getHeader() {
    if (id === Constants.ADD_COLUMN_ID) {
      return (
        <AddColumnHeader
          dataDispatch={dataDispatch}
          getHeaderProps={getHeaderProps}
        />
      );
    }

    return (
      <>
        <div {...getHeaderProps()} className="th noselect d-inline-block">
          <button
            className="th-content"
            onClick={() => setShowHeaderMenu(true)}
            ref={setHeaderMenuAnchorRef}
            disabled // Функционал кнопки работает, в будущем можно включить кнопку
          >
            <span className="svg-icon svg-gray icon-margin">
              <DataTypeIcon dataType={dataType} />
            </span>
            {label}
          </button>

          {getResizerProps && (
            <div {...getResizerProps()} className="resizer" />
          )}
        </div>

        {showHeaderMenu && (
          <div className="overlay" onClick={() => setShowHeaderMenu(false)} />
        )}

        {showHeaderMenu && (
          <HeaderMenu
            label={label}
            dataType={dataType}
            popper={headerMenuPopper}
            popperRef={setHeaderMenuPopperRef}
            dataDispatch={dataDispatch}
            setSortBy={setSortBy}
            columnId={id}
            setShowHeaderMenu={setShowHeaderMenu}
          />
        )}
      </>
    );
  }

  return getHeader();
}
