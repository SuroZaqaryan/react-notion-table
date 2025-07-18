import { Column } from 'react-table';
export interface ValueOption {
    value: string;
    is_popular: boolean;
}

export interface LabeledOption {
  label: string;
  value: string;
  backgroundColor: string;
}

export interface MainChar {
    name: string;
    values: ValueOption[];
    unit: string;
}

export interface CharacteristicItem {
    chapter_name: string;
    item_name: string;
    OKPD2: string;
    quantity: number,
    main_chars: MainChar[];
    dop_chars: MainChar[];
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

export interface TableRow {
    item_name?: string;
    name?: string;
    value?: string;
    unit?: string;
    options?: Array<{ label: string; value: string; backgroundColor: string }>;
    nameOptions?: Array<{ label: string; value: string; backgroundColor: string }>;
    isNewRow?: boolean;
    [key: string]: any; 
}

export interface TableColumn {
    id: string;
    label: string;
    accessor: string;
    dataType: string;
    created?: boolean;
    options?: { label: string; backgroundColor: string }[];
}

export interface TableMetadata {
    chapterName: string;
    itemName: string;
    okpd2: string;
    quantity: number,
}

export interface TableState {
    columns: Column[];
    data: TableRow[];
    skipReset: boolean;
    metadata: TableMetadata;
    dopChars?: MainChar[];
    mainChars?: MainChar[];
    selectedRowIndices: number[];
}

export interface TableData {
    id: string;
    state: TableState;
}

export interface CommonFields {
    date: string | Date;
    address: string;
}

export interface AppState {
    date: string | Date;
    address: string;
    tables: TableData[];
    bottomSections: [Warranty?, Payment?];
    skipReset?: boolean;
}

export type ReducerAction =
    | {
        type: "init";
        payload: {
            commonFields: CommonFields;
            bottomSections: [Warranty, Payment];
            tables: TableData[]
        }
    }
    | {
        type: "update_common_field";
        key: keyof CommonFields;
        value: string | Date
    }
    | {
        type: "update_bottom_section";
        index: number;
        key: keyof (Warranty & Payment);
        value: string
    }
    | {
        type: "update_table";
        tableId: string;
        action: TableAction
    }
    | {
        type: "reset_state";
    }
    | {
        type: "add_new_table";
        payload: TableData;
    }
    | {
        type: "remove_table";
        tableId: string;
    }
    | {
        type: "reorder_tables";
        newOrder: string[];
    };

export type TableAction =
    | { type: "update_data"; data: TableRow[] }
    | { type: "ADD_OPTION_TO_ROW"; rowIndex: number; option: { label: string; value: string; backgroundColor: string }, target: 'name' | 'value' }
    | { type: "INSERT_ROW"; triggeredFromRow: number, index: number, }
    | { type: "toggle_row_selection"; rowIndex: number }
    | { type: "delete_selected_rows" }
    | { type: "add_option_to_column"; columnId: string | number; option: string; backgroundColor: string }
    | { type: "update_column_type"; columnId: string | number; dataType: string }
    | { type: "update_metadata"; key: keyof TableMetadata; value: string }
    | { type: "update_column_header"; columnId: string | number; label: string }
    | { type: "update_cell"; rowIndex: number; columnId: string | number; value: string | number }
    | { type: "add_column_to_left"; columnId: string | number; focus: boolean }
    | { type: "add_column_to_right"; columnId: string | number; focus: boolean }
    | { type: "delete_column"; columnId: string | number }
    | { type: "enable_reset" }
    | { type: "init" }
    | {
        type: 'update_row_by_name';
        rowIndex: number;
        name: string;
    };