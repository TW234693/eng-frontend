export const NUTRIENTS = [
  {
    code: "SUGAR.added",
    label: { en: "Added sugar", pl: "Dodane cukry" },
    quantity: 0,
    unit: "g",
  },
  {
    code: "CA",
    label: { en: "Calcium, Ca", pl: "Wapń, Ca" },
    quantity: 0,
    unit: "mg",
  },
  {
    code: "CHOCDF.net",
    label: { en: "Carbohydrate (net)", pl: "Węglowodany (netto)" },
    quantity: 0,
    unit: "g",
  },
  {
    code: "CHOCDF",
    label: {
      en: "Carbohydrate, by difference",
      pl: "Węglowodany, przez różnicę",
    },
    quantity: 0,
    unit: "g",
  },
  {
    code: "CHOLE",
    label: { en: "Cholesterol", pl: "Cholesterol" },
    quantity: 0,
    unit: "mg",
  },
  {
    code: "ENERC_KCAL",
    label: { en: "Energy", pl: "Energia" },
    quantity: 0,
    unit: "kcal",
  },
  {
    code: "FAMS",
    label: {
      en: "Fatty acids, total monounsaturated",
      pl: "Kwasy tłuszczowe, jednonienasycone",
    },
    quantity: 0,
    unit: "g",
  },
  {
    code: "FAPU",
    label: {
      en: "Fatty acids, total polyunsaturated",
      pl: "Kwasy tłuszczowe, wielonienasycone",
    },
    quantity: 0,
    unit: "g",
  },
  {
    code: "FASAT",
    label: {
      en: "Fatty acids, total saturated",
      pl: "Kwasy tłuszczowe, nasycone",
    },
    quantity: 0,
    unit: "g",
  },
  {
    code: "FATRN",
    label: { en: "Fatty acids, total trans", pl: "Kwasy tłuszczowe, trans" },
    quantity: 0,
    unit: "g",
  },
  {
    code: "FIBTG",
    label: { en: "Fiber, total dietary", pl: "Błonnik pokarmowy, całkowity" },
    quantity: 0,
    unit: "g",
  },
  {
    code: "FOLDFE",
    label: { en: "Folate, DFE", pl: "Kwas foliowy, DFE" },
    quantity: 0,
    unit: "µg",
  },
  {
    code: "FOLFD",
    label: { en: "Folate, food", pl: "Kwas foliowy, z żywności" },
    quantity: 0,
    unit: "µg",
  },
  {
    code: "FOLAC",
    label: { en: "Folic acid", pl: "Kwas foliowy" },
    quantity: 0,
    unit: "µg",
  },
  {
    code: "FE",
    label: { en: "Iron, Fe", pl: "Żelazo, Fe" },
    quantity: 0,
    unit: "mg",
  },
  {
    code: "MG",
    label: { en: "Magnesium", pl: "Magnez" },
    quantity: 0,
    unit: "mg",
  },
  {
    code: "NIA",
    label: { en: "Niacin", pl: "Niacyna" },
    quantity: 0,
    unit: "mg",
  },
  {
    code: "P",
    label: { en: "Phosphorus, P", pl: "Fosfor, P" },
    quantity: 0,
    unit: "mg",
  },
  {
    code: "K",
    label: { en: "Potassium, K", pl: "Potas, K" },
    quantity: 0,
    unit: "mg",
  },
  {
    code: "PROCNT",
    label: { en: "Protein", pl: "Białko" },
    quantity: 0,
    unit: "g",
  },
  {
    code: "RIBF",
    label: { en: "Riboflavin", pl: "Ryboflawina" },
    quantity: 0,
    unit: "mg",
  },
  {
    code: "NA",
    label: { en: "Sodium, Na", pl: "Sód, Na" },
    quantity: 0,
    unit: "mg",
  },
  {
    code: "Sugar.alcohol",
    label: { en: "Sugar alcohols", pl: "Cukry alkoholowe" },
    quantity: 0,
    unit: "g",
  },
  {
    code: "SUGAR",
    label: { en: "Sugars, total", pl: "Cukry, łącznie" },
    quantity: 0,
    unit: "g",
  },
  {
    code: "THIA",
    label: { en: "Thiamin", pl: "Tiamina" },
    quantity: 0,
    unit: "mg",
  },
  {
    code: "FAT",
    label: { en: "Total lipid (fat)", pl: "Całkowity lipid (tłuszcz)" },
    quantity: 0,
    unit: "g",
  },
  {
    code: "VITA_RAE",
    label: { en: "Vitamin A, RAE", pl: "Witamina A, RAE" },
    quantity: 0,
    unit: "µg",
  },
  {
    code: "VITB12",
    label: { en: "Vitamin B-12", pl: "Witamina B12" },
    quantity: 0,
    unit: "µg",
  },
  {
    code: "VITB6A",
    label: { en: "Vitamin B-6", pl: "Witamina B6" },
    quantity: 0,
    unit: "mg",
  },
  {
    code: "VITC",
    label: {
      en: "Vitamin C, total ascorbic acid",
      pl: "Witamina C, całkowity kwas askorbinowy",
    },
    quantity: 0,
    unit: "mg",
  },
  {
    code: "VITD",
    label: { en: "Vitamin D (D2 + D3)", pl: "Witamina D (D2 + D3)" },
    quantity: 0,
    unit: "µg",
  },
  {
    code: "TOCPHA",
    label: {
      en: "Vitamin E (alpha-tocopherol)",
      pl: "WItamina E (alfa-tokoferylol)",
    },
    quantity: 0,
    unit: "mg",
  },
  {
    code: "VITK1",
    label: { en: "Vitamin K (phylloquinone)", pl: "Witamina K (filochinon)" },
    quantity: 0,
    unit: "µg",
  },
  { code: "WATER", label: { en: "Water", pl: "Woda" }, quantity: 0, unit: "g" },
  {
    code: "ZN",
    label: { en: "Zinc, Zn", pl: "Cynk, Zn" },
    quantity: 0,
    unit: "mg",
  },
];

export const NUTRIENTS_NO_LABELS = NUTRIENTS.map((nutrient) => {
  const { label, ...nutrientNoLabel } = nutrient;
  return nutrientNoLabel;
});
