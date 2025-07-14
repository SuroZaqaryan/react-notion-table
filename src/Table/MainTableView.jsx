import { useEffect, useReducer } from "react";
import "./styles/style.css";
import Table from "./ui/Table";
import { reducer } from "./lib/reducer";
import { randomColor } from "./utils/utils";
import exampleSpec from './exampleSpec.json'
import columns from './columns/columns'

// Функция для преобразования данных в формат таблицы
function transformSpecToTableData(spec) {
  const chapter = spec.chapters.find(ch => Array.isArray(ch.items));
  const item = chapter.items[0];

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

function MainTableView() {
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

export default MainTableView;