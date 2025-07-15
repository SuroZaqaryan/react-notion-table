import "./styles/style.css";
import exampleSpec from "./exampleSpec.json";
import { randomColor } from "./utils/utils";
import TableWrapper from "./ui/TableWrapper";

function transformSpecToTables(spec) {
  const tables = [];

  spec.chapters
    .filter(ch => Array.isArray(ch.items))
    .forEach(chapter => {
      chapter.items.forEach(item => {
        const rows = item.main_chars.map(char => {
          const options = char.values.map(v => ({
            label: v.value,
            backgroundColor: randomColor(),
          }));

          return {
            name: char.name,
            value: char.values[0].value,
            unit: char.unit || "",
            options,
          };
        });

        tables.push({
          id: `${item.item_name}-${Math.random().toString(36).slice(2)}`,
          chapterName: chapter.chapter_name,
          itemName: item.item_name,
          okpd2: item.OKPD2,
          data: rows,
        });
      });
    });

  return tables;
}

function MainTableView() {
  const tables = transformSpecToTables(exampleSpec);

  return (
    <div className="table-group">
      {tables.map(({ id, chapterName, itemName, okpd2, data }) => (
        <TableWrapper
          key={id}
          chapterName={chapterName}
          itemName={itemName}
          okpd2={okpd2}
          data={data}
        />
      ))}
    </div>
  );
}

export default MainTableView;
