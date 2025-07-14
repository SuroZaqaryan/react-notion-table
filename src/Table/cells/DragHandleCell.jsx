import { useDrag } from 'react-dnd';
import { GripVertical } from 'lucide-react';

export default function DragHandleCell({ rowIndex }) {
  const [, drag] = useDrag({
    type: 'row',
    item: { index: rowIndex }
  });

  return (
    <div
      ref={drag}
      style={{
        cursor: 'move',
        textAlign: 'center',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <GripVertical size={17} />
    </div>
  );
}