import { useReducer, useEffect, useRef } from "react";
import transformSpecToTables from './lib/transformSpecToTables';
import TableWrapper from "./ui/TableWrapper";
import TopInfoEditor from "./ui/TopInfoEditor";
import BottomInfoEditor from "./ui/BottomInfoEditor";
import { reducer, initialState } from "./lib/reducer";
import columns from "./columns/columns";

export interface ValueOption {
    value: string;
    is_popular: boolean;
}

export interface MainChar {
    name: string;
    unit?: string;
    values: ValueOption[];
}

export interface CharacteristicItem {
    chapter_name: string;
    item_name: string;
    OKPD2: string;
    main_chars: MainChar[];
    dop_chars?: MainChar[]; // Added as it's used in the code
}

export interface Warranty {
    chapter_name: string;
    description: string;
}

export interface Payment {
    chapter_name: string;
    description: string;
}

export interface RootData {
    date: string | Date; 
    address: string;
    characteristics: CharacteristicItem[];
    warranty: Warranty;
    payment: Payment;
}

interface TableState {
    columns: any; // Replace with proper column type if available
    data: any[]; // Replace with proper row type if available
    skipReset: boolean;
    metadata: {
        chapterName: string;
        itemName: string;
        okpd2: string;
    };
    dopChars?: any; // Replace with proper type if available
    selectedRowIndices: number[];
}

interface TableData {
    id: string;
    state: TableState;
}

interface AppState {
    date: string | Date;
    address: string;
    tables: TableData[];
    bottomSections: [Warranty?, Payment?];
}

function MainTableView() {
  const [state, dispatch] = useReducer(reducer, initialState as AppState);
  const lastPayloadRef = useRef<string | null>(null);

  useEffect(() => {
    if (!state) return;

    const characteristics = state.tables.map(({ state: table }) => {
      const { metadata, data } = table;

      const mainCharMap = new Map<string, MainChar>();
      const dopCharMap = new Map<string, MainChar>();

      for (const [idx, row] of data.entries()) {
        let key: string;
        if ((row as any).isNewRow) { // Replace 'any' with proper row type
          key = `newRow_${idx}`;
        } else {
          key = (row as any).name || ""; // Replace 'any' with proper row type
        }

        const targetMap = mainCharMap;

        if (!targetMap.has(key)) {
          targetMap.set(key, {
            name: (row as any).isNewRow ? (row as any).name || "" : key, // Replace 'any' with proper row type
            unit: (row as any).unit || "", // Replace 'any' with proper row type
            values: [],
          });
        }

        targetMap.get(key)?.values.push({
          value: (row as any).value || "", // Replace 'any' with proper row type
          is_popular: !(row as any).isNewRow, // Replace 'any' with proper row type
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

  const handleTopChange = (key: keyof Pick<AppState, 'date' | 'address'>, value: string | Date) => {
    dispatch({ type: "update_common_field", key, value });
  };

  const handleBottomChange = (index: number, key: keyof (Warranty & Payment), value: string) => {
    dispatch({ type: "update_bottom_section", index, key, value });
  };

  const handleTableDispatch = (tableId: string, action: any) => { // Replace 'any' with proper action type
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