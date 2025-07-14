import { useEffect, useReducer } from "react";
import "./style.css";
import Table from "./Table";
import { reducer } from "./lib/reducer";
import { randomColor } from "./utils";
import exampleSpec from './exampleSpec.json'

// Функция для преобразования данных в формат таблицы
function transformSpecToTableData(spec) {
  const chapter = spec.chapters.find(ch => Array.isArray(ch.items));
  const item = chapter.items[0];

  const columns = [
    { id: "selection", label: "", accessor: "selection", dataType: "checkbox", className: "hidden-col", width: 40, disableResizing: true },
    { id: "drag-handle", label: "", accessor: "drag-handle", dataType: "drag-handle", className: "hidden-col", width: 40, disableResizing: true },
    { id: "plus", label: "", accessor: "plus", dataType: "plus", className: "hidden-col", width: 40, disableResizing: true },
    { id: "name", label: "Название", accessor: "name", dataType: "text", options: [] },
    {
      id: "value",
      label: "Значение",
      accessor: "value",
      dataType: "select",
      options: []
    },
    { id: "unit", label: "Ед. измерения", accessor: "unit", dataType: "text", options: [] }
  ];

  const rows = item.main_chars.map(char => {
    const options = char.values.map(v => ({
      label: v.value,
      backgroundColor: randomColor(),
    }));

    return {
      item_name: item.item_name,
      name: char.name,
      value: char.values[0].value,
      unit: char.unit || '',
      options,
    };
  });

  return { columns, data: rows, skipReset: false };
}

function App() {
  const [state, dispatch] = useReducer(reducer, transformSpecToTableData(exampleSpec));

  useEffect(() => {
    dispatch({ type: "enable_reset" });
  }, [state.data, state.columns]);

  return (
    <Table
      columns={state.columns}
      data={state.data}
      dispatch={dispatch}
      skipReset={state.skipReset}
    />
  );
}

export default App;