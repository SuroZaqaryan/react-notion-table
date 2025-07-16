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

export default transformSpecToTables;