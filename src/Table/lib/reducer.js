import { randomColor, shortId } from "../utils/utils";

export function reducer(state, action) {
  switch (action.type) {
    case "update_data":
      return {
        ...state,
        data: action.data,
        skipReset: true
      };
    case 'ADD_OPTION_TO_ROW': {
      const newData = [...state.data];
      const row = newData[action.rowIndex];
      const existing = row.options || [];

      // Удаление дубликаты по label
      const newOptions = [...existing, action.option].filter(
        (opt, i, self) => i === self.findIndex(o => o.label === opt.label)
      );

      row.options = newOptions;

      return {
        ...state,
        skipReset: true,
        data: newData
      };
    }

    case 'INSERT_ROW': {
      const newData = [...state.data];
      const indicesToInsert = state.selectedRowIndices.length > 0
        ? [...state.selectedRowIndices].sort((a, b) => b - a)
        : [action.triggeredFromRow];

      for (const index of indicesToInsert) {
        const currentRow = newData[index];

        const relevantDopChars = state.dopChars.filter(char => char.name);

        if (!relevantDopChars.length) continue;

        const allNameOptions = relevantDopChars.map(char => ({
          label: char.name,
          value: char.name,
        }));

        const allValueOptions = relevantDopChars.flatMap(char =>
          char.values.map(v => ({
            label: v.value,
            value: v.value,
            backgroundColor: randomColor(),
          }))
        );

        const newRow = {
          item_name: currentRow.item_name,
          name: '', // будет SelectCell, пользователь выберет
          value: '', // будет SelectCell
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
              ...state.columns[optionIndex].options,
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
                [action.columnId]: isNaN(row[action.columnId])
                  ? ""
                  : Number.parseInt(row[action.columnId], 10),
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
            let options = [];
            state.data.forEach((row) => {
              if (row[action.columnId]) {
                options.push({
                  label: row[action.columnId],
                  backgroundColor: randomColor(),
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
                  options: [...state.columns[typeIndex].options, ...options],
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
              ...(isSelectionColumn && { selected: action.value }), // добавляем selected = true/false
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