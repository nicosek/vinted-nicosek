const detailsMap = {
  condition: "ÉTAT",
  city: "EMPLACEMENT",
  brand: "MARQUE",
  size: "TAILLE",
  color: "COULEUR",
};

const mapProductDetails = (data) => {
  return Object.entries(detailsMap)
    .filter(([key]) => data[key])
    .map(([key, label]) => ({ key: label, value: data[key] }));
};

module.exports = { detailsMap, mapProductDetails };
