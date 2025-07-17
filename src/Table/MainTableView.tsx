import { useReducer, useEffect, useRef } from "react";
import transformSpecToTables from './lib/transformSpecToTables';
import TableWrapper from "./ui/TableWrapper";
import TopInfoEditor from "./ui/TopInfoEditor";
import BottomInfoEditor from "./ui/BottomInfoEditor";
import { reducer, initialState } from "./lib/reducer";
import columns from "./columns/columns";
import {
  AppState,
  TableAction,
  RootData,
  Warranty,
  Payment,
  MainChar,
  CharacteristicItem,
} from './types/types';

function MainTableView() {
  const [state, dispatch] = useReducer(reducer, initialState as AppState);
  const lastPayloadRef = useRef<string | null>(null);

  useEffect(() => {
    if (!state) return;

    const characteristics: CharacteristicItem[] = state.tables.map(({ state: table }) => {
      const { metadata, data } = table;

      const mainCharMap = new Map<string, MainChar>();
      const dopCharMap = new Map<string, MainChar>();

      for (const [idx, row] of data.entries()) {
        const key = row.isNewRow ? `newRow_${idx}` : row.name || "";
        const targetMap = mainCharMap;

        if (!targetMap.has(key)) {
          targetMap.set(key, {
            name: row.isNewRow ? row.name || "" : key,
            unit: row.unit || "",
            values: [],
          });
        }

        targetMap.get(key)?.values.push({
          value: row.value || "",
          is_popular: !row.isNewRow,
        });
      }

      return {
        chapter_name: metadata.chapterName,
        item_name: metadata.itemName,
        OKPD2: metadata.okpd2,
        quantity: metadata.quantity,
        main_chars: Array.from(mainCharMap.values()),
        dop_chars: Array.from(dopCharMap.values()),
      };
    });

    const payload: RootData = {
      date: state.date,
      address: state.address,
      warranty: state.bottomSections[0] as Warranty,
      payment: state.bottomSections[1] as Payment,
      characteristics,
    };

    const payloadString = JSON.stringify(payload);
    if (payloadString !== lastPayloadRef.current) {
      console.log("FULL PAYLOAD", payload);
      lastPayloadRef.current = payloadString;
    }
  }, [state]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/exampleSpec.json");
        const data: RootData = await response.json();

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
                  quantity: table.quantity,
                },
                dopChars: table.dopChars,
                mainChars: table.mainChars,
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

  const handleTopChange = (key: keyof Pick<AppState, 'date' | 'address'>, value: string | Date) => {
    dispatch({ type: "update_common_field", key, value });
  };

  const handleBottomChange = (
    index: number,
    key: keyof (Warranty & Payment),
    value: string
  ) => {
    dispatch({ type: "update_bottom_section", index, key, value });
  };

  const handleTableDispatch = (tableId: string, action: TableAction) => {
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
          state={tableState}
          dispatch={(action: TableAction) => handleTableDispatch(id, action)}
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
