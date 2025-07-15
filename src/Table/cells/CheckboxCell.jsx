import { Checkbox } from 'antd';

export default function CheckboxCell({ rowIndex, dataDispatch, isSelected }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        cursor: 'pointer',
      }}
    >
      <Checkbox
        checked={isSelected}
        onChange={() => {
          dataDispatch({
            type: 'toggle_row_selection',
            rowIndex,
          });
        }}
      />
    </div>
  );
}
