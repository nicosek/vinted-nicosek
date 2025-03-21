const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;
const { getPage, getLimit } = require("../../utils/pagination_helpers");
const { buildFilters } = require("../offers/filters");

class BasePaginate {
  constructor(model, data, query) {
    this.model = model;
    this.data = data;
    this.query = query;
    this.filters = buildFilters(query);
  }

  // ✅ Méthode principale (ex `call()` en Ruby)
  async call() {
    return {
      total: await this.getTotal(),
      count: this.data.length,
      page: this.getPage(),
      totalPages: await this.getTotalPages(),
    };
  }

  // ✅ Récupère le nombre total d’éléments correspondant aux filtres
  async getTotal() {
    if (this._total !== undefined) return this._total;

    this._total = await this.model.countDocuments(this.getFilters());
    return this._total;
  }

  // ✅ Retourne le numéro de page
  getPage() {
    return getPage(this.query);
  }

  // ✅ Retourne la limite de résultats par page
  getLimit() {
    return getLimit(this.query);
  }

  // ✅ Calcule le total de pages
  async getTotalPages() {
    return this.getLimit()
      ? Math.ceil((await this.getTotal()) / this.getLimit())
      : 1;
  }

  // ✅ Récupère les filtres (ex : `status=available`)
  getFilters() {
    return buildFilters(this.query); // 🔥 buildFilters() est désormais bien placé
  }
}

module.exports = BasePaginate;
