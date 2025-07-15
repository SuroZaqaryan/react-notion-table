import { useReducer, useEffect } from "react";
import Table from "./Table";
import { reducer } from "../lib/reducer";
import columns from "../columns/columns";

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
    dopChars
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

  return (
    <div className="table-wrapper">
      <div className="editable-wrapper">
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

      <Table
        columns={state.columns}
        data={state.data}
        dispatch={dispatch}
        skipReset={state.skipReset}
      />
    </div>
  );
}

export default TableWrapper;
