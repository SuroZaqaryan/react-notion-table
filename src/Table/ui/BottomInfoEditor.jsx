import "../styles/style.css";
import { Typography } from "antd";
import EditableParagraph from "../ui/EditableParagraph";

function BottomInfoEditor({ sections, onChange }) {
  return (
    <div className="info-block">
      {sections.map(({ chapter_name, description }, index) => (
        <div key={index} >
          <EditableParagraph
            value={chapter_name}
            onChange={(val) => onChange(index, "chapter_name", val)}
            as={Typography.Title}
            asProps={{ level: 3 }}
          />

          <div style={{margin: '8px 0'}}>
            <EditableParagraph
              value={description}
              onChange={(val) => onChange(index, "description", val)}
              as={Typography.Paragraph}
              asProps={{ level: 4 }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default BottomInfoEditor;
