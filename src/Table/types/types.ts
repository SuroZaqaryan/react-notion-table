export interface ValueOption {
    value: string;
    is_popular: boolean;
}

export interface MainChar {
    name: string;
    values: ValueOption[];
}

export interface CharacteristicItem {
    chapter_name: string;
    item_name: string;
    OKPD2: string;
    main_chars: MainChar[];
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

// types.ts
export interface TableRow {
    item_name?: string;
    name?: string;
    value?: string;
    unit?: string;
    options?: Array<{ label: string; value: string; backgroundColor: string }>;
    nameOptions?: Array<{ label: string; value: string; backgroundColor: string }>;
    isNewRow?: boolean;
    [key: string]: any; // For dynamic column access
}

export interface TableColumn {
    id: string;
    label: string;
    accessor: string;
    dataType: string;
    created?: boolean;
    options?: { label: string; backgroundColor: string }[]; // <- поставь вопросительный знак
}

export interface TableMetadata {
    chapterName: string;
    itemName: string;
    okpd2: string;
}

export interface TableState {
    columns: TableColumn[];
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
    // Add any other top-level actions your reducer handles
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
        newOrder: string[]; // array of table IDs in new order
    };

// types.ts
export type TableAction =
    | { type: "update_data"; data: TableRow[] }
    | { type: "ADD_OPTION_TO_ROW"; rowIndex: number; option: { label: string; value: string; backgroundColor: string } }
    | { type: "INSERT_ROW"; triggeredFromRow: number }
    | { type: "toggle_row_selection"; rowIndex: number }
    | { type: "delete_selected_rows" }
    | { type: "add_option_to_column"; columnId: string; option: string; backgroundColor: string }
    | { type: "update_column_type"; columnId: string; dataType: string }
    | { type: "update_metadata"; key: keyof TableMetadata; value: string }
    | { type: "update_column_header"; columnId: string; label: string }
    | { type: "update_cell"; rowIndex: number; columnId: string; value: any }
    | { type: "add_column_to_left"; columnId: string; focus: boolean }
    | { type: "add_column_to_right"; columnId: string; focus: boolean }
    | { type: "delete_column"; columnId: string }
    | { type: "enable_reset" }
    | { type: "init" }
    | {
        type: 'update_row_by_name';
        rowIndex: number;
        name: string;
    }
    ;