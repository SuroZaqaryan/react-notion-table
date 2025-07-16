import { useReducer, useEffect } from "react";
import transformSpecToTables from './lib/transformSpecToTables';
import TableWrapper from "./ui/TableWrapper";
import TopInfoEditor from "./ui/TopInfoEditor";
import BottomInfoEditor from "./ui/BottomInfoEditor";
import { reducer, initialState } from "./lib/reducer";
import columns from "./columns/columns";

function MainTableView() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (!state) return;

    const characteristics = state.tables.map(({ state: table }) => {
      const { metadata, data } = table;

      const mainCharMap = new Map();
      const dopCharMap = new Map();

      for (const [idx, row] of data.entries()) {
        let key;
        if (row.isNewRow) {
          // Для новых строк используем уникальный ключ, например, индекс с префиксом
          key = `newRow_${idx}`;
        } else {
          key = row.name || "";
        }

        const targetMap = row.isNewRow ? dopCharMap : mainCharMap;

        if (!targetMap.has(key)) {
          targetMap.set(key, {
            // Для новых строк имя может быть пустым или как есть
            name: row.isNewRow ? row.name || "" : key,
            unit: row.unit || "",
            values: [],
          });
        }

        targetMap.get(key).values.push({
          value: row.value || "",
          is_popular: !row.isNewRow,
        });
      }

      return {
        chapter_name: metadata.chapterName,
        item_name: metadata.itemName,
        OKPD2: metadata.okpd2,
        main_chars: Array.from(mainCharMap.values()),
        dop_chars: Array.from(dopCharMap.values()),
      };
    });

    const payload = {
      date: state.date,
      address: state.address,
      warranty: state.bottomSections?.[0],
      payment: state.bottomSections?.[1],
      characteristics,
    };

    console.log("FULL PAYLOAD", payload);
  }, [state]);


  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/exampleSpec.json");
        const data = await response.json();

        const tables = transformSpecToTables(data);

        dispatch({
          type: "init",
          payload: {
            commonFields: {
              date: data.date,
              address: data.address,
            },
            bottomSections: [data.warranty, data.payment],
            tables: tables.map((table) => ({
              id: table.id,
              state: {
                columns,
                data: table.data,
                skipReset: false,
                metadata: {
                  chapterName: table.chapterName,
                  itemName: table.itemName,
                  okpd2: table.okpd2,
                },
                dopChars: table.dopChars,
                selectedRowIndices: [],
              },
            })),
          },
        });
      } catch (error) {
        console.error("Ошибка загрузки данных", error);
      }
    }

    fetchData();
  }, []);

  if (!state) {
    return <div>Загрузка данных...</div>;
  }

  const handleTopChange = (key, value) => {
    dispatch({ type: "update_common_field", key, value });
  };

  const handleBottomChange = (index, key, value) => {
    dispatch({ type: "update_bottom_section", index, key, value });
  };

  const handleTableDispatch = (tableId, action) => {
    dispatch({ type: "update_table", tableId, action });
  };

  return (
    <div className="table-group">
      <TopInfoEditor
        date={state.date}
        address={state.address}
        onChange={handleTopChange}
      />

      {state.tables.map(({ id, state: tableState }) => (
        <TableWrapper
          key={id}
          id={id}
          chapterName={tableState.metadata.chapterName}
          itemName={tableState.metadata.itemName}
          okpd2={tableState.metadata.okpd2}
          data={tableState.data}
          dopChars={tableState.dopChars}
          state={tableState}
          dispatch={(action) => handleTableDispatch(id, action)}
        />
      ))}

      <BottomInfoEditor
        sections={state.bottomSections}
        onChange={handleBottomChange}
      />
    </div>
  );
}

export default MainTableView;
