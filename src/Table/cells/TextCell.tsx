import React, { useEffect, useState } from 'react';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable'; 
import { ActionTypes } from '../utils/utils';
import { TableAction } from '../types/types';

interface TextCellProps {
  initialValue: string | number;
  columnId: string;
  rowIndex: number;
  dataDispatch: React.Dispatch<TableAction>;
}

export default function TextCell({
  initialValue,
  columnId,
  rowIndex,
  dataDispatch,
}: TextCellProps) {
  const [value, setValue] = useState<{ value: string; update: boolean }>({
    value: initialValue?.toString() || '',
    update: false,
  });

  function onChange(e: ContentEditableEvent) {
    setValue({ value: e.target.value, update: false });
  }

  function onBlur() {
    setValue(old => ({ value: old.value, update: true }));
  }

  useEffect(() => {
    setValue({ value: initialValue?.toString() || '', update: false });
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
  }, [value.update, columnId, rowIndex]);

  return (
    <ContentEditable
      html={value.value}
      onChange={onChange}
      onBlur={onBlur}
      className="data-input"
    />
  );
}
