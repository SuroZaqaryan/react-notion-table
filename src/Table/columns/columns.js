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
        label: "Название",
        accessor: "name",
        dataType: "text",
        options: []
    },
    {
        id: "value",
        label: "Значение",
        accessor: "value",
        dataType: "select",
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

export default columns;