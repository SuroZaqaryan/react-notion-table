import React, { useEffect, useState, Dispatch, SetStateAction } from 'react';
import { createPortal } from 'react-dom';
import { usePopper } from 'react-popper';
import Badge from '../ui/Badge';
import { Plus } from 'lucide-react';
import { ActionTypes } from '../utils/utils';
import { TableAction } from '../types/types';

interface LabeledOption {
  label: string;
  value: string;
  backgroundColor: string;
}

interface SelectCellProps {
  initialValue: string;
  options: LabeledOption[];
  columnId: string;
  rowIndex: number;
  dataDispatch: Dispatch<TableAction>;
}

export default function SelectCell({
  initialValue,
  options,
  columnId,
  rowIndex,
  dataDispatch,
}: SelectCellProps) {
  const [selectRef, setSelectRef] = useState<HTMLElement | null>(null);
  const [selectPop, setSelectPop] = useState<HTMLElement | null>(null);
  const [showSelect, setShowSelect] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [addSelectRef, setAddSelectRef] = useState<HTMLInputElement | null>(null);

  const { styles, attributes } = usePopper(selectRef, selectPop, {
    placement: 'bottom-start',
    strategy: 'fixed',
  });

  const [value, setValue] = useState<{ value: string; update: boolean }>({
    value: initialValue,
    update: false,
  });

  const getPortalRoot = (): HTMLElement => {
    let portalRoot = document.querySelector('#popper-portal');
    if (!portalRoot) {
      const newPortalRoot = document.createElement('div');
      newPortalRoot.id = 'popper-portal';
      document.body.appendChild(newPortalRoot);
      return newPortalRoot;
    }
    if (!(portalRoot instanceof HTMLElement)) {
      throw new Error('#popper-portal is not an HTMLElement');
    }
    return portalRoot;
  };


  useEffect(() => {
    setValue({ value: initialValue, update: false });
  }, [initialValue]);

  useEffect(() => {
    if (value.update) {
      dataDispatch({
        type: ActionTypes.UPDATE_CELL,
        columnId,
        rowIndex,
        value: value.value,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, columnId, rowIndex]);

  useEffect(() => {
    if (addSelectRef && showAdd) {
      addSelectRef.focus();
    }
  }, [addSelectRef, showAdd]);

  function handleAddOption() {
    setShowAdd(true);
  }

  function handleOptionKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      const newLabel = e.currentTarget.value.trim();
      if (newLabel !== '') {
        const option = { label: newLabel, value: newLabel, backgroundColor: '#fff' };

        dataDispatch({
          type: 'ADD_OPTION_TO_ROW',
          rowIndex,
          option,
          target: columnId === 'name' || columnId === 'value' ? columnId : 'value',
        });

        setValue({ value: newLabel, update: true });
        handleOptionClick(option);
      }

      setShowAdd(false);
      setShowSelect(false);
    }
  }

  function handleOptionBlur(e: React.FocusEvent<HTMLInputElement>) {
    const newLabel = e.currentTarget.value.trim();
    if (newLabel !== '') {
      const option = { label: newLabel, value: newLabel, backgroundColor: '#fff' };

      dataDispatch({
        type: 'ADD_OPTION_TO_ROW',
        rowIndex,
        option,
        target: columnId === 'name' || columnId === 'value' ? columnId : 'value',
      });

      setValue({ value: newLabel, update: true });
      handleOptionClick(option);
    }
    setShowAdd(false);
  }

  function handleOptionClick(option: LabeledOption) {
    if (columnId === 'name') {
      // Обновить name и запросить options для value
      dataDispatch({
        type: 'update_row_by_name',
        rowIndex,
        name: option.label,
      });
    } else {
      setValue({ value: option.label, update: true });
    }
    setShowSelect(false);
  }

  return (
    <>
      <div
        ref={setSelectRef}
        className="cell-padding d-flex cursor-default align-items-center flex-1"
        onClick={() => setShowSelect(true)}
      >
        {value.value && <Badge value={value.value} />}
      </div>
      {showSelect && <div className="overlay" onClick={() => setShowSelect(false)} />}
      {showSelect &&
        createPortal(
          <div
            className="shadow-5 bg-white border-radius-md"
            ref={setSelectPop}
            {...attributes.popper}
            style={{
              ...styles.popper,
              zIndex: 4,
              minWidth: 200,
              maxWidth: 320,
              maxHeight: 400,
              padding: '0.75rem',
              overflow: 'auto',
            }}
          >
            <div className="d-flex flex-wrap-wrap" style={{ marginTop: '-0.5rem' }}>
              {showAdd && (
                <div
                  key="add-option-input"
                  className="mr-5 mt-5 bg-grey-200 border-radius-sm"
                  style={{
                    width: 120,
                    padding: '2px 4px',
                    lineHeight: 1.5,
                  }}
                >
                  <input
                    type="text"
                    className="option-input"
                    onBlur={handleOptionBlur}
                    ref={setAddSelectRef}
                    onKeyDown={handleOptionKeyDown}
                  />
                </div>
              )}
              <div
                key="add-option-button"
                className="cursor-pointer mr-5 mt-5"
                onClick={handleAddOption}
              >
                <Badge
                  value={
                    <span
                      className="svg-icon-sm svg-text"
                      style={{ padding: 3, color: '#fff', fontSize: 14 }}
                    >
                      Добавить <Plus style={{ stroke: '#fff' }} />
                    </span>
                  }
                  backgroundColor="#44403C"
                />
              </div>
              {options.map((option) => (
                <div
                  key={option.label}
                  className="cursor-pointer mr-5 mt-5"
                  onClick={() => handleOptionClick(option)}
                >
                  <Badge value={option.label} backgroundColor="#E4E4E7" />
                </div>
              ))}
            </div>
          </div>,
          getPortalRoot()
        )}
    </>
  );
}
