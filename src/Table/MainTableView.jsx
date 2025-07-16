import "./styles/style.css";
import exampleSpec from "./exampleSpec.json";
import TableWrapper from "./ui/TableWrapper";
import TopInfoEditor from "./ui/TopInfoEditor";
import BottomInfoEditor from "./ui/BottomInfoEditor";
import { useState } from "react";
import { reducer } from "./lib/reducer";
import columns from "./columns/columns";

function transformSpecToTables(spec) {
  const tables = [];

  spec.characteristics?.forEach((item) => {
    const rows = item.main_chars.map((char) => {
      const options = char.values.map((v) => ({
        label: v.value,
        value: v.value,
        backgroundColor: "#E4E4E7",
      }));

      const popular = char.values.find((v) => v.is_popular);

      return {
        item_name: item.item_name,
        name: char.name,
        value: popular?.value || char.values[0].value,
        unit: char.unit || "",
        options,
      };
    });

    tables.push({
      id: `${item.item_name}-${Math.random().toString(36).slice(2)}`,
      chapterName: item.chapter_name,
      itemName: item.item_name,
      okpd2: item.OKPD2,
      data: rows,
      dopChars: item.dop_chars || [],
    });
  });

  return tables;
}

function MainTableView() {
  const [specState, setSpecState] = useState(exampleSpec);
  const [tablesState, setTablesState] = useState(() => {
    const tables = transformSpecToTables(exampleSpec);
    return tables.map(table => ({
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
      }
    }));
  });

  const handleTopChange = (key, value) => {
    setSpecState((prev) => ({ ...prev, [key]: value }));
  };

  const handleBottomChange = (index, key, value) => {
    const keys = ["warranty", "payment"];
    setSpecState((prev) => ({
      ...prev,
      [keys[index]]: {
        ...prev[keys[index]],
        [key]: value,
      },
    }));
  };

  const handleTableDispatch = (tableId, action) => {
    setTablesState(prev => prev.map(table => {
      if (table.id === tableId) {
        const newState = reducer(table.state, action);
        return { ...table, state: newState };
      }
      return table;
    }));
  };

  const tables = transformSpecToTables(specState);

  function transformFullStateToSpec() {
    const characteristics = tablesState.map(({ state }) => {
      const { metadata, data, dopChars } = state;

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
        chapter_name: metadata.chapterName,
        item_name: metadata.itemName,
        OKPD2: metadata.okpd2,
        main_chars: Array.from(mainCharMap.values()),
        dop_chars: Array.from(dopCharMap.values()),
      };
    });

    const payload = {
      date: specState.date,
      address: specState.address,
      characteristics,
      warranty: specState.warranty,
      payment: specState.payment,
    };

    console.log("FULL PAYLOAD", payload);
  }


  return (
    <div className="table-group">
      <button onClick={transformFullStateToSpec}>Собрать полный payload</button>

      {/* Дата и Адрес */}
      <TopInfoEditor
        date={specState.date}
        address={specState.address}
        onChange={handleTopChange}
      />

      {/* Таблицы */}
      {tablesState.map(({ id, state }) => {
        const tableData = tables.find(t => t.id === id);
        return (
          <TableWrapper
            key={id}
            id={id}
            chapterName={state.metadata.chapterName}
            itemName={state.metadata.itemName}
            okpd2={state.metadata.okpd2}
            data={state.data}
            dopChars={state.dopChars}
            state={state}
            dispatch={(action) => handleTableDispatch(id, action)}
          />
        );
      })}

      {/* Оплата и Гарантия */}
      <BottomInfoEditor
        sections={[specState.warranty, specState.payment]}
        onChange={handleBottomChange}
      />
    </div>
  );
}

export default MainTableView;