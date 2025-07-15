
import { Plus } from 'lucide-react';

export default function PlusCell({ rowIndex, dataDispatch }) {
  return (
    <span
      className="svg-icon svg-gray icon-margin"
      onClick={(e) => {
        e.stopPropagation();
        dataDispatch({
          type: 'INSERT_ROW',
          index: rowIndex + 1,
          triggeredFromRow: rowIndex,
        });
      }}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer'
      }}
    >
      <Plus style={{ top: 0 }} size={15} />
    </span>
  );
}
