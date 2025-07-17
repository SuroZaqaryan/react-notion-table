import { shortId } from "../utils/utils";
import { AppState, ReducerAction, TableAction, LabeledOption, TableState, TableRow, Warranty, Payment } from "../types/types";

export const initialState: AppState | null = null;

export function reducer(state: AppState | null, action: ReducerAction): AppState {
  if (state === null) {
    if (action.type === "init") {
      return {
        ...action.payload.commonFields,
        bottomSections: action.payload.bottomSections,
        tables: action.payload.tables,
      };
    }
    throw new Error("Cannot reduce null state without init action");
  }

  switch (action.type) {
    case "update_common_field":
      return {
        ...state,
        [action.key]: action.value,
        skipReset: true,
      };

    case "update_bottom_section":
      const updatedSections = [...state.bottomSections] as [Warranty?, Payment?];

      if (updatedSections[action.index]) {
        updatedSections[action.index] = {
          ...updatedSections[action.index],
          [action.key]: action.value,
        } as Warranty | Payment;
      }

      return {
        ...state,
        bottomSections: updatedSections as [Warranty?, Payment?],
        skipReset: true,
      };

    case "update_table":
      return {
        ...state,
        tables: state.tables.map((table) =>
          table.id === action.tableId
            ? { ...table, state: tableReducer(table.state, action.action) }
            : table
        ),
      };

    default:
      return state;
  }
}

function tableReducer(state: TableState, action: TableAction): TableState {
  switch (action.type) {
    case "update_data":
      return {
        ...state,
        data: action.data,
        skipReset: true
      };

    case 'ADD_OPTION_TO_ROW': {
      const newData = [...state.data];
      const row = { ...newData[action.rowIndex] };

      const addUniqueOption = (options: LabeledOption[] = []): LabeledOption[] =>
        [...options, action.option].filter(
          (opt, i, self) => self.findIndex(o => o.label === opt.label) === i
        );

      if (action.target === 'name') {
        row.nameOptions = addUniqueOption(row.nameOptions);
      } else {
        row.options = addUniqueOption(row.options);
      }

      newData[action.rowIndex] = row;

      return {
        ...state,
        skipReset: true,
        data: newData,
      };
    }



    case 'INSERT_ROW': {
      const newData = [...state.data];
      const indicesToInsert = state.selectedRowIndices.length > 0
        ? [...state.selectedRowIndices].sort((a, b) => b - a)
        : [action.triggeredFromRow];

      for (const index of indicesToInsert) {
        const currentRow = newData[index];
        const relevantDopChars = state.dopChars?.filter(char => char.name) || [];

        if (!relevantDopChars.length) continue;

        const currentMainChar = state.mainChars?.find(mc => mc.name === currentRow.name);

        const dopNameOptions = relevantDopChars.map(char => ({
          label: char.name,
          value: char.name,
          backgroundColor: '#FFF',
        }));

        const initialNameOption = currentMainChar
          ? {
            label: currentMainChar.name,
            value: currentMainChar.name,
            backgroundColor: '#FFF',
          }
          : null;

        const allNameOptions = initialNameOption
          ? [...dopNameOptions.filter(opt => opt.value !== initialNameOption.value), initialNameOption]
          : dopNameOptions;

        const allValueOptions = relevantDopChars.flatMap(char =>
          char.values.map(v => ({
            label: v.value,
            value: v.value,
            backgroundColor: '#FFF',
          }))
        );

        const newRow: TableRow = {
          item_name: currentRow.item_name,
          name: '',
          value: '',
          unit: '',
          options: allValueOptions,
          nameOptions: allNameOptions,
          isNewRow: true,
        };

        newData.splice(index + 1, 0, newRow);
      }

      return {
        ...state,
        data: newData,
        skipReset: true,
        selectedRowIndices: [],
      };
    }

    case 'toggle_row_selection': {
      const selected = new Set(state.selectedRowIndices);
      if (selected.has(action.rowIndex)) {
        selected.delete(action.rowIndex);
      } else {
        selected.add(action.rowIndex);
      }

      return {
        ...state,
        selectedRowIndices: [...selected],
      };
    }

    case 'delete_selected_rows': {
      const newData = state.data.filter((_, index) => !state.selectedRowIndices.includes(index));
      return {
        ...state,
        data: newData,
        selectedRowIndices: [],
        skipReset: true,
      };
    }

    case "add_option_to_column":
      const optionIndex = state.columns.findIndex(
        (column) => column.id === action.columnId
      );
      return {
        ...state,
        skipReset: true,
        columns: [
          ...state.columns.slice(0, optionIndex),
          {
            ...state.columns[optionIndex],
            options: [
              ...(state.columns[optionIndex].options ?? []),
              { label: action.option, backgroundColor: action.backgroundColor },
            ],
          },
          ...state.columns.slice(optionIndex + 1, state.columns.length),
        ],
      };

    case "update_column_type":
      const typeIndex = state.columns.findIndex(
        (column) => column.id === action.columnId
      );
      switch (action.dataType) {
        case "number":
          if (state.columns[typeIndex].dataType === "number") {
            return state;
          } else {
            return {
              ...state,
              columns: [
                ...state.columns.slice(0, typeIndex),
                { ...state.columns[typeIndex], dataType: action.dataType },
                ...state.columns.slice(typeIndex + 1, state.columns.length),
              ],
              data: state.data.map((row) => ({
                ...row,
                [action.columnId]: isNaN(Number(row[action.columnId]))
                  ? ""
                  : Number.parseInt(row[action.columnId] as string, 10),
              })),
            };
          }
        case "select":
          if (state.columns[typeIndex].dataType === "select") {
            return {
              ...state,
              columns: [
                ...state.columns.slice(0, typeIndex),
                { ...state.columns[typeIndex], dataType: action.dataType },
                ...state.columns.slice(typeIndex + 1, state.columns.length),
              ],
              skipReset: true,
            };
          } else {
            let options: Array<{ label: string; backgroundColor: string }> = [];
            state.data.forEach((row) => {
              if (row[action.columnId]) {
                options.push({
                  label: row[action.columnId] as string,
                  backgroundColor: '#FFF',
                });
              }
            });
            return {
              ...state,
              columns: [
                ...state.columns.slice(0, typeIndex),
                {
                  ...state.columns[typeIndex],
                  dataType: action.dataType,
                  options: [
                    ...(state.columns[typeIndex].options ?? []),
                    ...options,
                  ],

                },
                ...state.columns.slice(typeIndex + 1, state.columns.length),
              ],
              skipReset: true,
            };
          }
        case "text":
          if (state.columns[typeIndex].dataType === "text") {
            return state;
          } else if (state.columns[typeIndex].dataType === "select") {
            return {
              ...state,
              skipReset: true,
              columns: [
                ...state.columns.slice(0, typeIndex),
                { ...state.columns[typeIndex], dataType: action.dataType },
                ...state.columns.slice(typeIndex + 1, state.columns.length),
              ],
            };
          } else {
            return {
              ...state,
              skipReset: true,
              columns: [
                ...state.columns.slice(0, typeIndex),
                { ...state.columns[typeIndex], dataType: action.dataType },
                ...state.columns.slice(typeIndex + 1, state.columns.length),
              ],
              data: state.data.map((row) => ({
                ...row,
                [action.columnId]: row[action.columnId] + "",
              })),
            };
          }
        default:
          return state;
      }

    case "update_metadata":
      return {
        ...state,
        skipReset: true,
        metadata: {
          ...state.metadata,
          [action.key]: action.value,
        },
      };

    case "update_column_header":
      const index = state.columns.findIndex(
        (column) => column.id === action.columnId
      );
      return {
        ...state,
        skipReset: true,
        columns: [
          ...state.columns.slice(0, index),
          { ...state.columns[index], label: action.label },
          ...state.columns.slice(index + 1, state.columns.length),
        ],
      };

    case 'update_row_by_name': {
      const { rowIndex, name } = action;

      const targetChar =
        state.dopChars?.find(char => char.name === name) ||
        state.mainChars?.find(char => char.name === name);

      const options = targetChar?.values.map(v => ({
        label: v.value,
        value: v.value,
        backgroundColor: '#FFF',
      })) ?? [];

      const popularValue = targetChar?.values.find(v => v.is_popular)?.value || '';

      return {
        ...state,
        skipReset: true,
        data: state.data.map((row, i) =>
          i === rowIndex
            ? {
              ...row,
              name,
              options,
              value: popularValue,
            }
            : row
        ),
      };
    }

    case "update_cell":
      return {
        ...state,
        skipReset: true,
        data: state.data.map((row, index) => {
          if (index === action.rowIndex) {
            const isSelectionColumn = action.columnId === "selection";
            return {
              ...row,
              [action.columnId]: action.value,
              ...(isSelectionColumn && { selected: action.value }),
            };
          }
          return row;
        }),
      };

    case "add_column_to_left":
      const leftIndex = state.columns.findIndex(
        (column) => column.id === action.columnId
      );
      let leftId = shortId();
      return {
        ...state,
        skipReset: true,
        columns: [
          ...state.columns.slice(0, leftIndex),
          {
            id: leftId,
            label: "Column",
            accessor: leftId,
            dataType: "text",
            created: action.focus && true,
            options: [],
          },
          ...state.columns.slice(leftIndex, state.columns.length),
        ],
      };

    case "add_column_to_right":
      const rightIndex = state.columns.findIndex(
        (column) => column.id === action.columnId
      );
      const rightId = shortId();
      return {
        ...state,
        skipReset: true,
        columns: [
          ...state.columns.slice(0, rightIndex + 1),
          {
            id: rightId,
            label: "Column",
            accessor: rightId,
            dataType: "text",
            created: action.focus && true,
            options: [],
          },
          ...state.columns.slice(rightIndex + 1, state.columns.length),
        ],
      };

    case "delete_column":
      const deleteIndex = state.columns.findIndex(
        (column) => column.id === action.columnId
      );
      return {
        ...state,
        skipReset: true,
        columns: [
          ...state.columns.slice(0, deleteIndex),
          ...state.columns.slice(deleteIndex + 1, state.columns.length),
        ],
      };
    case "enable_reset":
      return {
        ...state,
        skipReset: false,
      };

    default:
      return state;
  }
}