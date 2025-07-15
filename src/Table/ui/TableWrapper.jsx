import { useReducer, useEffect } from "react";
import Table from "./Table";
import { reducer } from "../lib/reducer";
import columns from "../columns/columns";
import { Trash2 } from 'lucide-react';
import { Button, Tooltip } from 'antd';

function TableWrapper({ chapterName, itemName, okpd2, data, dopChars }) {
  const [state, dispatch] = useReducer(reducer, {
    columns,
    data,
    skipReset: false,
    metadata: {
      chapterName,
      itemName,
      okpd2,
    },
    dopChars,
    selectedRowIndices: [],
  });

  useEffect(() => {
    dispatch({ type: "enable_reset" });
  }, [state.data, state.columns]);

  const handleChange = (key) => (e) => {
    dispatch({
      type: "update_metadata",
      key,
      value: e.target.value,
    });
  };

  const handleDeleteSelected = () => {
    dispatch({ type: 'delete_selected_rows' });
  };

  return (
    <div className="table-wrapper">
      <div className="editable-wrapper">
        <div className="editable-fields">
          <input
            value={state.metadata.chapterName}
            onChange={handleChange("chapterName")}
            className="editable-title"
          />
          <p>
            <strong>Изделие:</strong>{" "}
            <input
              value={state.metadata.itemName}
              onChange={handleChange("itemName")}
              className="editable-field"
            />
          </p>
          <p>
            <strong>ОКПД2:</strong>{" "}
            <input
              value={state.metadata.okpd2}
              onChange={handleChange("okpd2")}
              className="editable-field"
            />
          </p>
        </div>

        <div>
          {
            state.selectedRowIndices.length > 0 &&

            <Tooltip placement="top" title={`Выбрано строк: ${state.selectedRowIndices.length}`}>
              <Button
                type="primary"
                size="sm"
                icon={<Trash2 style={{ display: 'flex' }} size={16} />}
                danger
                style={{ opacity: '0.9' }}
                onClick={handleDeleteSelected}
              >
                Удалить
              </Button>
            </Tooltip>
          }
        </div>
      </div>

      <Table
        columns={state.columns}
        data={state.data}
        dispatch={dispatch}
        skipReset={state.skipReset}
        selectedRowIndices={state.selectedRowIndices}
      />
    </div>
  );
}

export default TableWrapper;
