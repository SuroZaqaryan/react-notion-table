import { useRef, useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { GripVertical } from 'lucide-react';

interface DragHandleCellProps {
  rowIndex: number;
}

export default function DragHandleCell({ rowIndex }: DragHandleCellProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [, drag] = useDrag(() => ({
    type: 'row',
    item: { index: rowIndex },
  }), [rowIndex]);

  useEffect(() => {
    if (ref.current) {
      drag(ref.current);
    }
  }, [drag]);

  return (
    <div
      ref={ref}
      style={{
        cursor: 'move',
        textAlign: 'center',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <GripVertical size={17} />
    </div>
  );
}
