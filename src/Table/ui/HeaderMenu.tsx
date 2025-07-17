import React, { useState, useEffect, Dispatch } from 'react';
import { ArrowDown, ArrowUp, ArrowLeft, ArrowRight, Trash2 } from 'lucide-react';
import { grey } from '../utils/colors';
import TypesMenu from './TypesMenu';
import { usePopper } from 'react-popper';
import { ActionTypes, shortId } from '../utils/utils';
import DataTypeIcon from '../lib/DataTypeIcon';
import { TableAction } from '../types/types';

interface HeaderMenuProps {
  label: string;
  dataType: string;
  columnId: string | number;
  setSortBy: (sortBy: { id: string | number; desc?: boolean }[]) => void;
  popper: ReturnType<typeof usePopper>;
  popperRef: React.Ref<HTMLDivElement>;
  dataDispatch: Dispatch<TableAction>;
  setShowHeaderMenu: (value: boolean) => void;
}

export default function HeaderMenu({
  label,
  dataType,
  columnId,
  setSortBy,
  popper,
  popperRef,
  dataDispatch,
  setShowHeaderMenu,
}: HeaderMenuProps) {
  const [inputRef, setInputRef] = useState<HTMLInputElement | null>(null);
  const [header, setHeader] = useState(label);
  const [typeReferenceElement, setTypeReferenceElement] = useState<HTMLElement | null>(null);
  const [typePopperElement, setTypePopperElement] = useState<HTMLElement | null>(null);
  const typePopper = usePopper(typeReferenceElement, typePopperElement, {
    placement: 'right',
    strategy: 'fixed',
  });
  const [showTypeMenu, setShowTypeMenu] = useState(false);

  function onTypeMenuClose() {
    setShowTypeMenu(false);
    setShowHeaderMenu(false);
  }

  useEffect(() => {
    setHeader(label);
  }, [label]);

  useEffect(() => {
    if (inputRef) {
      inputRef.focus();
      inputRef.select();
    }
  }, [inputRef]);

  const buttons = [
    {
      onClick: () => {
        dataDispatch({
          type: ActionTypes.UPDATE_COLUMN_HEADER,
          columnId,
          label: header,
        });
        setSortBy([{ id: columnId, desc: false }]);
        setShowHeaderMenu(false);
      },
      icon: <ArrowUp />,
      label: 'Sort ascending',
    },
    {
      onClick: () => {
        dataDispatch({
          type: ActionTypes.UPDATE_COLUMN_HEADER,
          columnId,
          label: header,
        });
        setSortBy([{ id: columnId, desc: true }]);
        setShowHeaderMenu(false);
      },
      icon: <ArrowDown />,
      label: 'Sort descending',
    },
    {
      onClick: () => {
        dataDispatch({
          type: ActionTypes.UPDATE_COLUMN_HEADER,
          columnId,
          label: header,
        });
        dataDispatch({
          type: ActionTypes.ADD_COLUMN_TO_LEFT,
          columnId,
          focus: false,
        });
        setShowHeaderMenu(false);
      },
      icon: <ArrowLeft />,
      label: 'Insert left',
    },
    {
      onClick: () => {
        dataDispatch({
          type: ActionTypes.UPDATE_COLUMN_HEADER,
          columnId,
          label: header,
        });
        dataDispatch({
          type: ActionTypes.ADD_COLUMN_TO_RIGHT,
          columnId,
          focus: false,
        });
        setShowHeaderMenu(false);
      },
      icon: <ArrowRight />,
      label: 'Insert right',
    },
    {
      onClick: () => {
        dataDispatch({ type: ActionTypes.DELETE_COLUMN, columnId });
        setShowHeaderMenu(false);
      },
      icon: <Trash2 />,
      label: 'Delete',
    },
  ];

  function handleColumnNameKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      dataDispatch({
        type: ActionTypes.UPDATE_COLUMN_HEADER,
        columnId,
        label: header,
      });
      setShowHeaderMenu(false);
    }
  }

  function handleColumnNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setHeader(e.target.value);
  }

  function handleColumnNameBlur(e: React.FocusEvent<HTMLInputElement>) {
    e.preventDefault();
    dataDispatch({
      type: ActionTypes.UPDATE_COLUMN_HEADER,
      columnId,
      label: header,
    });
  }

  return (
    <div
      ref={popperRef}
      style={{ ...popper.styles.popper, zIndex: 10 }}
      {...(popper.attributes.popper ?? {})}
    >
      <div
        className="bg-white shadow-5 border-radius-md"
        style={{
          width: 240,
        }}
      >
        <div
          style={{
            paddingTop: '0.75rem',
            paddingLeft: '0.75rem',
            paddingRight: '0.75rem',
          }}
        >
          <div className="is-fullwidth" style={{ marginBottom: 12 }}>
            <input
              className="form-input is-fullwidth"
              ref={setInputRef}
              type="text"
              value={header}
              onChange={handleColumnNameChange}
              onBlur={handleColumnNameBlur}
              onKeyDown={handleColumnNameKeyDown}
            />
          </div>
          <span className="font-weight-600 font-size-75 color-grey-500 text-transform-uppercase">
            Property Type
          </span>
        </div>
        <div className="list-padding">
          <button
            className="sort-button"
            type="button"
            onMouseEnter={() => setShowTypeMenu(true)}
            onMouseLeave={() => setShowTypeMenu(false)}
            ref={setTypeReferenceElement}
          >
            <span className="svg-icon svg-text icon-margin">
              <DataTypeIcon dataType={dataType} />
            </span>
            <span className="text-transform-capitalize">{dataType}</span>
          </button>
          {showTypeMenu && (
            <TypesMenu
              popper={typePopper}
              popperRef={setTypePopperElement}
              onClose={onTypeMenuClose}
              setShowTypeMenu={setShowTypeMenu}
              columnId={columnId}
              dataDispatch={dataDispatch}
            />
          )}
        </div>
        <div style={{ borderTop: `2px solid ${grey(200)}` }} />
        <div className="list-padding">
          {buttons.map((button) => (
            <button
              type="button"
              className="sort-button"
              onMouseDown={button.onClick}
              key={shortId()}
            >
              <span className="svg-icon svg-text icon-margin">{button.icon}</span>
              {button.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}