import "../styles/style.css";

function BottomInfoEditor({ sections, onChange }) {
  return (
    <div className="bottom-info">
      {sections.map(({ chapter_name, description }, index) => (
        <div key={index} className="bottom-info__section">
          <h3>
            <input
              value={chapter_name}
              onChange={(e) =>
                onChange(index, "chapter_name", e.target.value)
              }
              className="editable-title"
            />
          </h3>
          <textarea
            value={description}
            onChange={(e) =>
              onChange(index, "description", e.target.value)
            }
            className="editable-textarea"
          />
        </div>
      ))}
    </div>
  );
}

export default BottomInfoEditor;
