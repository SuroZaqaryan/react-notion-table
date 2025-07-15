import "./styles/style.css";
import exampleSpec from "./exampleSpec.json";
import TableWrapper from "./ui/TableWrapper";
import TopInfoEditor from "./ui/TopInfoEditor";
import BottomInfoEditor from "./ui/BottomInfoEditor";
import { useState } from "react";

function transformSpecToTables(spec) {
  const tables = [];

  spec.characteristics?.forEach((item) => {
    const rows = item.main_chars.map((char) => {
      const options = char.values.map((v) => ({
        label: v.value,
        value: v.value,
        backgroundColor: "#E4E4E7",
      }));

      const popular = char.values.find((v) => v.is_popular);

      return {
        item_name: item.item_name,
        name: char.name,
        value: popular?.value || char.values[0].value,
        unit: char.unit || "",
        options,
      };
    });

    tables.push({
      id: `${item.item_name}-${Math.random().toString(36).slice(2)}`,
      chapterName: item.chapter_name,
      itemName: item.item_name,
      okpd2: item.OKPD2,
      data: rows,
      dopChars: item.dop_chars || [],
    });
  });

  return tables;
}

function MainTableView() {
  const [specState, setSpecState] = useState(exampleSpec);

  const handleTopChange = (key, value) => {
    setSpecState((prev) => ({ ...prev, [key]: value }));
  };

  const handleBottomChange = (index, key, value) => {
    const keys = ["warranty", "payment"];
    setSpecState((prev) => ({
      ...prev,
      [keys[index]]: {
        ...prev[keys[index]],
        [key]: value,
      },
    }));
  };

  const tables = transformSpecToTables(specState);

  return (
    <div className="table-group">
      {/* Дата и Адрес */}
      <TopInfoEditor
        date={specState.date}
        address={specState.address}
        onChange={handleTopChange}
      />

      {/* Таблицы */}
      {tables.map(({ id, chapterName, itemName, okpd2, data, dopChars }) => (
        <TableWrapper
          key={id}
          chapterName={chapterName}
          itemName={itemName}
          okpd2={okpd2}
          data={data}
          dopChars={dopChars}
        />
      ))}

      {
        <>
          {/* Оплата и Гарантия */}
          <BottomInfoEditor
            sections={[specState.warranty, specState.payment]}
            onChange={handleBottomChange}
          />
        </>
      }

    </div>
  );
}

export default MainTableView;
