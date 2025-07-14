export default function PlusCell({ rowIndex, dataDispatch }) {
    return (
        <span
            className="svg-icon svg-gray icon-margin"
            onClick={(e) => {
                e.stopPropagation();
                dataDispatch({ type: 'INSERT_ROW', index: rowIndex + 1 });
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
            <img src='https://www.iconpacks.net/icons/2/free-plus-icon-3107-thumb.png' width={16} height={16} />
        </span>
    );
}