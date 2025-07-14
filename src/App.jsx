import { useEffect, useReducer } from "react";
import "./style.css";
import Table from "./Table";
import { reducer } from "./lib/reducer";
import { randomColor } from "./utils";
import exampleSpec from './exampleSpec.json'

// Функция для преобразования данных в формат таблицы
function transformSpecToTableData(spec) {
  const chapter = spec.parameters.chapters[0];

  // Создаем колонки
  const columns = [
    {
      id: "selection",
      label: "",
      accessor: "selection",
      dataType: "checkbox",
      className: "hidden-col",
      width: 40,
      disableResizing: true
    },
    // колонка для перетаскивания
    {
      id: "drag-handle",
      label: "",
      accessor: "drag-handle",
      dataType: "drag-handle",
      className: "hidden-col",
      width: 40,
      disableResizing: true
    },
    {
      id: "plus",
      label: "",
      accessor: "plus",
      dataType: "plus",
      className: "hidden-col",
      width: 40,
      disableResizing: true
    },
    {
      id: "category",
      label: "Категория",
      accessor: "category",
      dataType: "text",
      options: []
    },
    {
      id: "name",
      label: "Название",
      accessor: "name",
      dataType: "text",
      options: []
    },
    {
      id: "value",
      label: "Значение",
      accessor: "value",
      dataType: "text",
      options: []
    },
    {
      id: "unit",
      label: "Ед. измерения",
      accessor: "unit",
      dataType: "text",
      options: []
    }
  ];

  // Создаем строки и находим варианты значений из dop_chars
  const rows = [];

  chapter.main_chars.forEach(char => {
    // Находим альтернативные значения из dop_chars
    const alternatives = chapter.dop_chars.filter(
      d => d.name === char.name
    );

    // Если есть альтернативы, меняем тип на select и добавляем опции
    if (alternatives.length > 0) {
      const valueColumn = columns.find(c => c.id === "value");
      valueColumn.dataType = "select";

      // Добавляем все варианты (текущее значение + альтернативы)
      const allOptions = [
        { label: char.value, backgroundColor: randomColor() },
        ...alternatives.map(a => ({
          label: a.value,
          backgroundColor: randomColor()
        }))
      ];

      // Удаляем дубликаты
      valueColumn.options = allOptions.filter(
        (option, index, self) =>
          index === self.findIndex(o => o.label === option.label)
      );
    }

    rows.push({
      category: char.category,
      name: char.name,
      value: char.value,
      unit: char.unit
    });
  });

  return { columns, data: rows, skipReset: false };
}

function App() {
  const [state, dispatch] = useReducer(reducer, transformSpecToTableData(exampleSpec));

  useEffect(() => {
    dispatch({ type: "enable_reset" });
  }, [state.data, state.columns]);

  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      overflowX: "hidden",
      paddingRight: "9rem",
    }}>
      <div style={{ overflow: "auto", display: "flex" }}>
        <div style={{
          flex: "1 1 auto",
          marginLeft: "90",
          marginRight: "auto",
        }}>
          <Table
            columns={state.columns}
            data={state.data}
            dispatch={dispatch}
            skipReset={state.skipReset}
          />
        </div>
      </div>
    </div>
  );
}

export default App;