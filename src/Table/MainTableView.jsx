import "./styles/style.css";
import exampleSpec from "./exampleSpec.json";
import { randomColor } from "./utils/utils";
import TableWrapper from "./ui/TableWrapper";

// Функция преобразует данные в массив таблиц
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
            item_name: item.item_name,
            name: char.name,
            value: char.values[0].value,
            unit: char.unit || "",
            options,
          };
        });

        tables.push({
          id: `${item.item_name}-${Math.random().toString(36).slice(2)}`,
          itemName: item.item_name,
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
      {tables.map(({ id, itemName, data }) => (
        <TableWrapper key={id} itemName={itemName} data={data} />
      ))}
    </div>
  );
}

export default MainTableView;
