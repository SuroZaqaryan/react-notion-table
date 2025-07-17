import React, { useEffect, useState, Dispatch, useRef } from 'react';
import { createPortal } from 'react-dom';
import { usePopper } from 'react-popper';
import Badge from '../ui/Badge';
import { Input, Flex, Button, Typography, Empty, InputRef } from 'antd';
import { Plus, Search } from 'lucide-react';
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

const { Text, Title } = Typography;

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
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newOptionLabel, setNewOptionLabel] = useState('');

  const addSelectRef = useRef<InputRef>(null);

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

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      addSelectRef.current!.focus();
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

  function handleModalOk() {
    const trimmedLabel = newOptionLabel.trim();
    if (!trimmedLabel) return;

    const option = {
      label: trimmedLabel,
      value: trimmedLabel,
      backgroundColor: '#fff',
    };

    dataDispatch({
      type: 'ADD_OPTION_TO_ROW',
      rowIndex,
      option,
      target: columnId === 'name' || columnId === 'value' ? columnId : 'value',
    });

    setValue({ value: trimmedLabel, update: true });
    handleOptionClick(option);
    setShowAdd(false);
    setNewOptionLabel('');
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
            className="cell"
            ref={setSelectPop}
            {...attributes.popper}
            style={{
              ...styles.popper,
              zIndex: 4,
              minWidth: 270,
              maxWidth: 320,
              maxHeight: 400,
              padding: '0.75rem',
              overflow: 'auto',
            }}
          >

            {showAdd ?
              <div
                className="option-add-block"
                style={{
                  padding: '8px 4px',
                }}
              >
                <Flex justify="space-between" align="center" style={{ marginBottom: 8 }}>
                  <Title level={5} style={{ margin: 0, fontSize: 16 }}>
                    + Новая опция
                  </Title>
                  <Button
                    type="text"
                    onClick={() => setShowAdd(false)}
                    size="small"
                  >
                    ✕
                  </Button>
                </Flex>

                <div style={{marginTop: 12, marginBottom: 2}}>
                  <Input
                    placeholder="Введите название опции"
                    ref={addSelectRef}
                    value={newOptionLabel}
                    onChange={(e) => setNewOptionLabel(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleModalOk();
                    }}
                    style={{ width: '100%', marginBottom: 12, height: 35 }}
                  />
                </div>

                <Flex gap={8}>
                  <Button style={{ flex: 1, background: '#44403C' }} type="primary" onClick={handleModalOk}>
                    Добавить
                  </Button>
                  <Button style={{ flex: 1 }} onClick={() => setShowAdd(false)}>Отмена</Button>
                </Flex>
              </div>

              :

              <Flex vertical style={{ marginTop: '-0.5rem' }}>
                <Input
                  placeholder="Поиск..."
                  prefix={<Search size={14} color='gray' style={{ marginRight: 4 }} />}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ marginTop: 8, marginBottom: 4, height: 36 }}
                />


                <div className='cell-option-block'>
                  {!filteredOptions.length && <Empty description='Нет данных' className='empty-options' />}

                  {filteredOptions.map((option) => (
                    <div
                      key={option.label}
                      className="cell-option"
                      onClick={() => handleOptionClick(option)}
                    >

                      <p className="cell-option-text">
                        <span style={{ color: 'gray' }}> •</span>
                        {option.label}
                      </p>
                    </div>
                  ))}
                </div>

                <Button
                  type='primary'
                  key="add-option-button"
                  onClick={handleAddOption}
                  icon={<Flex><Plus color='#fff' size={16} /></Flex>}
                  style={{ background: '#44403C', position: 'sticky', bottom: 0, height: 36 }}
                >
                  <Text style={{ color: '#fff', fontSize: 14, marginBottom: 4, marginRight: 8 }}>
                    Добавить
                  </Text>
                </Button>
              </Flex>
            }





          </div>,
          getPortalRoot()
        )}
    </>
  );
}
