const sampleOffers = [
  {
    productName: "Air Max 90",
    productDescription: "Air Max 90, très peu portées",
    productPrice: 80,
    productDetails: [
      { key: "MARQUE", value: "Nike" },
      { key: "TAILLE", value: "44" },
      { key: "ÉTAT", value: "Neuf" },
      { key: "COULEUR", value: "Bleu" },
      { key: "EMPLACEMENT", value: "Paris" },
    ],
  },
  {
    productName: "Sweat à capuche Adidas",
    productDescription: "Sweat Adidas taille L, neuf avec étiquette",
    productPrice: 50,
    productDetails: [
      { key: "MARQUE", value: "Adidas" },
      { key: "TAILLE", value: "L" },
      { key: "ÉTAT", value: "Neuf" },
      { key: "COULEUR", value: "Noir" },
      { key: "EMPLACEMENT", value: "Lyon" },
    ],
  },
  {
    productName: "Montre Casio Vintage",
    productDescription: "Montre Casio vintage, bon état",
    productPrice: 25,
    productDetails: [
      { key: "MARQUE", value: "Casio" },
      { key: "ÉTAT", value: "Bon état" },
      { key: "COULEUR", value: "Doré" },
      { key: "EMPLACEMENT", value: "Marseille" },
    ],
  },
  // Ajout de 27 autres offres variées...
  ...Array.from({ length: 27 }, (_, i) => ({
    productName: `Produit aléatoire ${i + 4}`,
    productDescription: `Description générique du produit ${i + 4}`,
    productPrice: Math.floor(Math.random() * 200) + 10,
    productDetails: [
      {
        key: "MARQUE",
        value: ["Nike", "Adidas", "Puma", "Zara", "H&M"][i % 5],
      },
      { key: "TAILLE", value: ["S", "M", "L", "XL", "XXL"][i % 5] },
      {
        key: "ÉTAT",
        value: ["Neuf", "Très bon état", "Bon état", "Usé"][i % 4],
      },
      {
        key: "COULEUR",
        value: ["Rouge", "Vert", "Bleu", "Noir", "Blanc"][i % 5],
      },
      {
        key: "EMPLACEMENT",
        value: ["Paris", "Lyon", "Marseille", "Toulouse", "Nice"][i % 5],
      },
    ],
  })),
];

module.exports = sampleOffers;
