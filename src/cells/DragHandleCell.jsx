import { useDrag } from 'react-dnd';

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
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 3h2v2H9zm4 0h2v2h-2zM9 7h2v2H9zm4 0h2v2h-2zM9 11h2v2H9zm4 0h2v2h-2zM9 15h2v2H9zm4 0h2v2h-2zM9 19h2v2H9zm4 0h2v2h-2z" fill="currentColor"/>
      </svg>
    </div>
  );
}