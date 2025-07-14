export default function CheckboxCell({
  initialValue,
  rowIndex,
  columnId,
  dataDispatch,
}) {
  return (
    <input
      type="checkbox"
      checked={initialValue || false}
      onChange={(e) => {
        dataDispatch({
          type: 'update_cell',
          rowIndex,
          columnId,
          value: e.target.checked,
        });
      }}
      style={{ margin: '0 auto', display: 'flex', cursor: 'pointer', alignItems: 'center', height: '100%' }}
    />
  );
}