import { useEffect } from "react";
import Table from "./Table";
import { Trash2 } from 'lucide-react';
import { Button, Tooltip, Typography } from 'antd';
import EditableParagraph from "./EditableParagraph";

const { Title } = Typography;

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

  return (
    <div className="table-wrapper">
      <div className="editable-wrapper">
        <div className="editable-fields">
          <EditableParagraph
            value={state.metadata.chapterName}
            onChange={handleMetadataChange("chapterName")}
            as={Typography.Title}
            asProps={{ level: 4 }}
            label={<Title level={5} style={{ margin: 0, fontWeight: 400, color: '#7c7c7c' }}>
              Характеристики закупаемых товаров:
            </Title>}
          />

          <EditableParagraph
            value={state.metadata.itemName}
            onChange={handleMetadataChange("itemName")}
            as={Typography.Title}
            asProps={{ level: 5 }}
            label={<Title level={5} style={{ margin: 0, fontWeight: 400, color: '#7c7c7c' }}>
              Наименование товара:
            </Title>}
          />

          <EditableParagraph
            value={state.metadata.okpd2}
            onChange={handleMetadataChange("okpd2")}
            as={Typography.Title}
            asProps={{ level: 5 }}
            label={<Title level={5} style={{ margin: 0, fontWeight: 400, color: '#7c7c7c' }}>
              ОКПД2:
            </Title>}
          />

          <EditableParagraph
            value={state.metadata.quantity}
            onChange={handleMetadataChange("quantity")}
            as={Typography.Title}
            asProps={{ level: 5 }}
            label={<Title level={5} style={{ margin: 0, fontWeight: 400, color: '#7c7c7c' }}>
              Количество:
            </Title>}
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