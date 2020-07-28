class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // BUILD QUERY
    // 1) a- Filtering
    const queryObj = {...this.queryString};
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(field => delete queryObj[field]);
    // console.log(req.query, queryObj);

    // 1) b- Advanced Filtering
    /*
    * As we filter difficulty[gte]=5 we will get an object {difficulty: {gte: 5}}
    * so we want to replace these filters with MongoDB functions i.e: $gte
    * \b\b : to match the exact word, g: replace all filters if we have multiple
    */
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    // 2)- Sorting
    /*
    * Ascending: sort=criteria, Descending: sort=-criteria
    * Sort by another criteria if we have similar ones
    * sort=criteria1,criteria2 => sort('criteria1 criteria2')
    */
    if (this.queryString.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else { // default sort
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  fieldsLimiting() {
    // 3)- Fields Limiting
    /* Select(project) only specified fields */
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else { // default fields
      this.query = this.query.select('-__v'); // exclude __v field
    }

    return this;
  }

  paginate() {
    // 4)- Pagination
    /*
     *
     * limit: number of records to show per page
     * skip: number of records to be skipped
     * ex: page 1: 1-10, page 2: 11-20, page 3: 21-30
     */
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    // if (this.queryString .page) {
    //   const numberOfTours = await Tour.countDocuments();
    //   if (skip > numberOfTours) throw new Error('This page does not exist!');
    // }
    return this;
  }
}

module.exports = APIFeatures;
