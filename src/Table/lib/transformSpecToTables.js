function transformSpecToTables(spec) {
  const tables = [];

  spec.characteristics?.forEach((item) => {

    // options для name из dop_chars
    const nameOptions = (item.dop_chars || []).map(char => ({
      label: char.name,
      value: char.name,
      backgroundColor: "#E4E4E7",
    }));

    const rows = item.main_chars.map((char) => {
      const options = char.values.map((v) => ({
        label: v.value,
        value: v.value,
        backgroundColor: "#E4E4E7",
      }));

      const popular = char.values.find((v) => v.is_popular);

      const nameOptionsFromDop = (item.dop_chars || []).map(dop => ({
        label: dop.name,
        value: dop.name,
        backgroundColor: "#E4E4E7",
      }));

      const initialNameOption = {
        label: char.name,
        value: char.name,
        backgroundColor: "#E4E4E7",
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
      data: rows,
      dopChars: item.dop_chars || [],
      mainChars: item.main_chars || [], 
    });
  });

  return tables;
}

export default transformSpecToTables;