export function shortId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

export const ActionTypes = Object.freeze({
  ADD_OPTION_TO_COLUMN: 'add_option_to_column',
  UPDATE_COLUMN_TYPE: 'update_column_type',
  UPDATE_COLUMN_HEADER: 'update_column_header',
  UPDATE_CELL: 'update_cell',
  ADD_COLUMN_TO_LEFT: 'add_column_to_left',
  ADD_COLUMN_TO_RIGHT: 'add_column_to_right',
  DELETE_COLUMN: 'delete_column',
  ENABLE_RESET: 'enable_reset',
});

export const DataTypes = Object.freeze({
  TEXT: 'text',
  NUMBER: 'number',
  SELECT: 'select',
  CHECKBOX: 'checkbox',
  DRAG_HANDLE: 'drag-handle',
  PLUS: 'plus'
});

export const Constants = Object.freeze({
  ADD_COLUMN_ID: 999999,
});
