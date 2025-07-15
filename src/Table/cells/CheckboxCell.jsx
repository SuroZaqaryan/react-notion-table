export default function CheckboxCell({
  rowIndex,
  dataDispatch,
  isSelected,
}) {
  return (
    <input
      type="checkbox"
      checked={isSelected}
      onChange={() => {
        dataDispatch({
          type: 'toggle_row_selection',
          rowIndex,
        });
      }}
      style={{
        margin: '0 auto',
        display: 'flex',
        cursor: 'pointer',
        alignItems: 'center',
        height: '100%',
      }}
    />
  );
}
