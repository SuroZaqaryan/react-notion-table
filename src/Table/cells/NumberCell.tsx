import React, { useEffect, useState } from 'react';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import { ActionTypes } from '../utils/utils';

type ActionType = typeof ActionTypes[keyof typeof ActionTypes];

interface NumberCellProps {
  initialValue: string | number;
  columnId: string;
  rowIndex: number;
  dataDispatch: React.Dispatch<{
    type: ActionType;
    columnId: string;
    rowIndex: number;
    value: string | number;
  }>;
}

export default function NumberCell({
  initialValue,
  columnId,
  rowIndex,
  dataDispatch,
}: NumberCellProps) {
  const [value, setValue] = useState<{ value: string | number; update: boolean }>({
    value: initialValue,
    update: false,
  });

  function onChange(e: ContentEditableEvent) {
    setValue({ value: e.target.value, update: false });
  }

  function onBlur() {
    setValue(old => ({ value: old.value, update: true }));
  }

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
  }, [value.update, columnId, rowIndex]);

  return (
    <ContentEditable
      html={value.value?.toString() || ''}
      onChange={onChange}
      onBlur={onBlur}
      className="data-input text-align-right"
    />
  );
}
