import "../styles/style.css";
import { Flex, Typography } from 'antd';
import EditableParagraph from "../ui/EditableParagraph";

const { Title } = Typography;

function TopInfoEditor({ date, address, onChange }) {
  return (
    <Flex vertical className="info-block">
      <EditableParagraph
        value={address}
        onChange={(val) => onChange("address", val)}
        as={Typography.Title}
        asProps={{ level: 4 }}
        label={<Title level={5} style={{ margin: 0, fontWeight: 400, color: '#7c7c7c' }}>Место поставки товара:</Title>}
      />

      <EditableParagraph
        value={date}
        onChange={(val) => onChange("date", val)}
        as={Typography.Title}
        asProps={{ level: 4 }}
        inputWidth={200}
        label={
          <Title level={5} style={{ margin: 0, fontWeight: 400, color: '#7c7c7c' }}>
            Срок поставки товара не должен превышать календарных дней:
          </Title>
        }
      />
    </Flex>
  );
}

export default TopInfoEditor;