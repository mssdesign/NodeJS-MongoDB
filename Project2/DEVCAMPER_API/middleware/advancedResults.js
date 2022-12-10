const advancedResults = (model, populate) => async (req, res, next) => {
  let query

  //Copy req.query
  const reqQuery = { ...req.query }

  //fields to exclude (removendo palavras para não serem utilizadas no filtro diretamente)
  const removeFields = ['select', 'sort', 'page', 'limit']

  //loop over removeFields and delete from reqQuery
  removeFields.forEach((param) => delete reqQuery[param])

  //Create query string
  let queryStr = JSON.stringify(reqQuery)

  //Create operators ($gt, $gte, etc)
  //Aqui os parâmetros de uma requisição no postman: {{URL}}/api/v1/bootcamps?averageCost[lte]=10000 foram transformados em uma query {"averageCost":{"$lte":"10000"}} com o sinal de dolar
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`)

  //finding resource
  query = model.find(JSON.parse(queryStr))

  //Select fields (requisição: {{URL}}/api/v1/bootcamps?select=name,description)
  if (req.query.select) {
    //fazendo com que a requisição fique com um espaço entre name e description conforme o select do mongoose que contem espaço https://mongoosejs.com/docs/queries.html
    const fields = req.query.select.split(',').join(' ')
    query = query.select(fields)
  }

  //sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ')
    query = query.sort(sortBy)
  } else {
    query = query.sort('-createdAt')
  }

  //Pagination
  const page = parseInt(req.query.page, 10) || 1
  const limit = parseInt(req.query.limit, 10) || 25
  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  const total = await model.countDocuments(JSON.parse(queryStr))

  query = query.skip(startIndex).limit(limit)

  if (populate) {
    query = query.populate(populate)
  }

  //Executing query
  const results = await query

  // Pagination result
  const pagination = {}

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    }
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    }
  }

  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results,
  }

  next()
}

module.exports = advancedResults
