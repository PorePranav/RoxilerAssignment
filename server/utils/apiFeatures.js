class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  search() {
    if (this.queryString.search) {
      const searchValue = this.queryString.search;
      const searchNumber = parseFloat(searchValue);

      const queryArray = [
        { title: { $regex: searchValue, $options: 'i' } },
        { description: { $regex: searchValue, $options: 'i' } },
      ];

      if (!isNaN(searchNumber)) {
        queryArray.push({ price: searchNumber });
      }

      this.query = this.query.find({
        $or: queryArray,
      });
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
