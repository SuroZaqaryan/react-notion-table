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
    { id: "drag-handle", label: "", accessor: "drag-handle", dataType: "drag-handle", className: "hidden-col", width: 40, disableResizing: true },
    { id: "plus", label: "", accessor: "plus", dataType: "plus", className: "hidden-col", width: 40, disableResizing: true },
    {
        id: "name",
        label: "Название товара",
        accessor: "name",
        dataType: "text",
        className: "name-col",
        options: []
    },
    {
        id: "value",
        label: "Бренд, модель, цвет, размер, материал",
        width: 340,
        accessor: "value",
        dataType: "select",
        options: []
    },
    {
        id: "unit",
        label: "Ед. измерения",
        width: 160,
        accessor: "unit",
        dataType: "text",
        className: "unit-col",
        options: []
    }
];

export default columns;