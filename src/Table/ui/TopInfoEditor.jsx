import "../styles/style.css";
import { Typography } from 'antd';
import EditableParagraph from "../ui/EditableParagraph";

function TopInfoEditor({ date, address, onChange }) {
  return (
    <div className="info-block">
      <EditableParagraph
        value={address}
        onChange={(val) => onChange("address", val)}
        as={Typography.Title}
        asProps={{ level: 3 }}
      />

      <EditableParagraph
        value={date}
        onChange={(val) => onChange("date", val)}
        as={Typography.Title}
        asProps={{ level: 4 }}
      />
    </div>
  );
}

export default TopInfoEditor;