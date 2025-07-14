import { useReducer, useEffect } from "react";
import Table from "./Table";
import { reducer } from "../lib/reducer";
import columns from "../columns/columns";

function TableWrapper({ chapterName, itemName, okpd2, data }) {
  const [state, dispatch] = useReducer(reducer, {
    columns,
    data,
    skipReset: false,
  });

  useEffect(() => {
    dispatch({ type: "enable_reset" });
  }, [state.data, state.columns]);

  return (
    <div className="table-wrapper">
      <h2>{chapterName}</h2>
      <p><strong>Изделие:</strong> {itemName}</p>
      <p><strong>ОКПД2:</strong> {okpd2}</p>
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
