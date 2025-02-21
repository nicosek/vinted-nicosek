const mergeProductDetails = (existingDetails, newDetails) => {
  // 🔄 Convertir l'ancien tableau en objet clé/valeur pour faciliter la fusion
  const detailsMap = Object.fromEntries(
    existingDetails.map((d) => [d.key, d.value])
  );

  // 🔄 Ajouter / mettre à jour les nouvelles valeurs
  newDetails.forEach(({ key, value }) => {
    detailsMap[key] = value; // 🚀 Met à jour ou ajoute une nouvelle entrée
  });

  // 📌 Convertir de nouveau en tableau de `{ key, value }`
  return Object.entries(detailsMap).map(([key, value]) => ({ key, value }));
};

module.exports = { mergeProductDetails };
