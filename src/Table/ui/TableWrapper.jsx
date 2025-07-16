import { useEffect } from "react";
import Table from "./Table";
import { Trash2 } from 'lucide-react';
import { Button, Tooltip, Typography } from 'antd';
import EditableParagraph from "./EditableParagraph";

function TableWrapper({
  state,
  dispatch
}) {
  useEffect(() => {
    dispatch({ type: "enable_reset" });
  }, [state.data, state.columns]);

  const handleMetadataChange = (key) => (value) => {
    dispatch({
      type: "update_metadata",
      key,
      value,
    });
  };

  const handleDeleteSelected = () => {
    dispatch({ type: 'delete_selected_rows' });
  };

  const transform = () => {
    function transformStateToSpec(state) {
      const { metadata, data } = state;

      const mainCharMap = new Map();
      const dopCharMap = new Map();

      for (const row of data) {
        const key = row.name || '';

        const targetMap = row.isNewRow ? dopCharMap : mainCharMap;

        if (!targetMap.has(key)) {
          targetMap.set(key, {
            name: key,
            unit: row.unit || '',
            values: [],
          });
        }

        targetMap.get(key).values.push({
          value: row.value || '',
          is_popular: !row.isNewRow,
        });
      }

      return {
        characteristics: [
          {
            chapter_name: metadata.chapterName,
            item_name: metadata.itemName,
            OKPD2: metadata.okpd2,
            main_chars: Array.from(mainCharMap.values()),
            dop_chars: Array.from(dopCharMap.values()),
          },
        ],
      };
    }

    const payload = transformStateToSpec(state);
    console.log('payload', payload);
  }

  return (
    <div className="table-wrapper">
      <button onClick={transform}>123</button>
      <div className="editable-wrapper">
        <div className="editable-fields">
          <EditableParagraph
            value={state.metadata.chapterName}
            onChange={handleMetadataChange("chapterName")}
            as={Typography.Title}
            asProps={{ level: 3 }}
          />

          <EditableParagraph
            value={state.metadata.itemName}
            onChange={handleMetadataChange("itemName")}
            as={Typography.Title}
            asProps={{ level: 5 }}
          />

          <EditableParagraph
            value={state.metadata.okpd2}
            onChange={handleMetadataChange("okpd2")}
            as={Typography.Title}
            asProps={{ level: 5 }}
          />
        </div>

        <div>
          {state.selectedRowIndices.length > 0 && (
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
          )}
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