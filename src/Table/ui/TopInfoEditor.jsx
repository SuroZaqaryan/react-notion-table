import "../styles/style.css";

function TopInfoEditor({ date, address, onChange }) {
  return (
    <div className="top-info">
      <div className="top-info__field">
        <strong>Дата:</strong>{" "}
        <input
          value={date}
          onChange={(e) => onChange("date", e.target.value)}
          className="editable-field"
        />
      </div>
      
      <div className="top-info__field">
        <strong>Адрес:</strong>{" "}
        <input
          value={address}
          onChange={(e) => onChange("address", e.target.value)}
          className="editable-field"
        />
      </div>
    </div>
  );
}

export default TopInfoEditor;
