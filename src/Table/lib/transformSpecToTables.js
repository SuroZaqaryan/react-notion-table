function transformSpecToTables(spec) {
  const tables = [];

  spec.characteristics?.forEach((item) => {
    const rows = item.main_chars.map((char) => {
      const options = char.values.map((v) => ({
        label: v.value,
        value: v.value,
        backgroundColor: "#FFF",
      }));

      const popular = char.values.find((v) => v.is_popular);

      const nameOptionsFromDop = (item.dop_chars || []).map(dop => ({
        label: dop.name,
        value: dop.name,
        backgroundColor: "#f0f0f091",
      }));

      const initialNameOption = {
        label: char.name,
        value: char.name,
        backgroundColor: "#FFF",
      };

      const nameOptions = [
        ...nameOptionsFromDop.filter(opt => opt.value !== char.name),
        initialNameOption,
      ];

      return {
        item_name: item.item_name,
        name: char.name,
        value: popular?.value || char.values[0].value,
        unit: char.unit || "",
        options,
        nameOptions,
      };
    });

    tables.push({
      id: `${item.item_name}-${Math.random().toString(36).slice(2)}`,
      chapterName: item.chapter_name,
      itemName: item.item_name,
      okpd2: item.OKPD2,
      quantity: item.quantity,
      data: rows,
      dopChars: item.dop_chars || [],
      mainChars: item.main_chars || [], 
    });
  });

  return tables;
}

export default transformSpecToTables;