const ErrorResponse = require('../utils/errorResponse')
const Bootcamp = require('../models/Bootcamp')
const geocoder = require('../utils/geocoder')
const asyncHandler = require('../middleware/async')

// @desc Get all bootcamps
// @route   GET /api/v1/bootcamps
// @acess    Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
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
  query = Bootcamp.find(JSON.parse(queryStr)).populate('courses')

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
  const limit = parseInt(req.query.limit, 10) || 1
  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  const total = await Bootcamp.countDocuments()

  query = query.skip(startIndex).limit(limit)

  //Executing query
  const bootcamps = await query

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

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    pagination,
    data: bootcamps,
  })
})

// @desc Get single bootcamp
// @route   GET /api/v1/bootcamps/:id
// @acess    Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id)

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    )
  }

  res.status(200).json({ success: true, data: bootcamp })
})

// @desc create new bootcamp
// @route   POST /api/v1/bootcamps
// @acess    Private (tem que mandar token)
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body)

  res.status(201).json({
    success: true,
    data: bootcamp,
  })

  next(err)
})

// @desc create new bootcamps
// @route   PUT /api/v1/bootcamps/:id
// @acess    Private (tem que mandar token)
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    )
  }

  res.status(200).json({ success: true, data: bootcamp })
})

// @desc create Delete bootcamps
// @route   DELETE /api/v1/bootcamps/:id
// @acess    Private (tem que mandar token)
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id)

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    )
  }

  bootcamp.remove(); //Aciona o middleware pois o "findByIdAndDelete" não aciona

  res.status(200).json({ success: true, data: {} })
})

// @desc Get bootcamps within a radius
// @route   GET /api/v1/bootcamps/radius/:zipcode/:distance
// @acess    Private (tem que mandar token)
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params

  //Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode)
  const lat = loc[0].latitude
  const lng = loc[0].longitude

  //Calc radius using radians
  //Divide distance by radius of earth
  //Earth radius = 3,963 mi/ 6,378 km
  const radius = distance / 3963

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  })

  res.status(200).json({
    sucess: true,
    count: bootcamps.length,
    data: bootcamps,
  })
})
