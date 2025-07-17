import { CharacteristicItem, MainChar, TableState } from "../types/types";

export function mapTablesToCharacteristics(tables: { state: TableState }[]): CharacteristicItem[] {
  return tables.map(({ state: table }) => {
    const { metadata, data } = table;

    const mainCharMap = new Map<string, MainChar>();
    const dopCharMap = new Map<string, MainChar>();

    for (const [idx, row] of data.entries()) {
      const key = row.isNewRow ? `newRow_${idx}` : row.name || "";
      const targetMap = mainCharMap;

      if (!targetMap.has(key)) {
        targetMap.set(key, {
          name: row.isNewRow ? row.name || "" : key,
          unit: row.unit || "",
          values: [],
        });
      }

      const added = targetMap.get(key);
      if (!added) continue;

      const mainValue = row.value;

      for (const opt of row.options || []) {
        if (!opt.label) continue;
        added.values.push({
          value: opt.label,
          is_popular: false,
        });
      }

      if (mainValue) {
        added.values = added.values.filter(v => v.value !== mainValue);
        added.values.push({
          value: mainValue,
          is_popular: true,
        });
      }
    }

    return {
      chapter_name: metadata.chapterName,
      item_name: metadata.itemName,
      OKPD2: metadata.okpd2,
      quantity: metadata.quantity,
      main_chars: Array.from(mainCharMap.values()),
      dop_chars: Array.from(dopCharMap.values()),
    };
  });
}
