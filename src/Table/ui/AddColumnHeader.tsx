import { Plus } from 'lucide-react';
import { ActionTypes, Constants } from '../utils/utils';

type AddColumnHeaderProps = {
  getHeaderProps: () => React.HTMLAttributes<HTMLDivElement>;
  dataDispatch: React.Dispatch<{
    type: typeof ActionTypes.ADD_COLUMN_TO_LEFT;
    columnId: number;
    focus: boolean;
  }>;
};

export default function AddColumnHeader({ getHeaderProps, dataDispatch }: AddColumnHeaderProps) {
  return (
    <div {...getHeaderProps()} className="th noselect d-inline-block">
      <div
        className="th-content d-flex justify-content-center"
        onClick={() =>
          dataDispatch({
            type: ActionTypes.ADD_COLUMN_TO_LEFT,
            columnId: Constants.ADD_COLUMN_ID,
            focus: true,
          })
        }
      >
        <span className="svg-icon-sm svg-gray">
          <Plus />
        </span>
      </div>
    </div>
  );
}
