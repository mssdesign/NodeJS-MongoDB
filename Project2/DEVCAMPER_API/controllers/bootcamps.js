const ErrorResponse = require('../utils/errorResponse')
const Bootcamp = require('../models/Bootcamp')
const geocoder = require('../utils/geocoder')
const asyncHandler = require('../middleware/async')

// @desc Get all bootcamps
// @route   GET /api/v1/bootcamps
// @acess    Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query

  let queryStr = JSON.stringify(req.query)

  //Aqui os parâmetros de uma requisição no postman: {{URL}}/api/v1/bootcamps?averageCost[lte]=10000 foram transformados em uma query {"averageCost":{"$lte":"10000"}} com o sinal de dolar
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)
  console.log(queryStr)

  query = Bootcamp.find(JSON.parse(queryStr))

  const bootcamps = await query

  res
    .status(200)
    .json({ sucess: true, count: bootcamps.length, data: bootcamps })
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
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    )
  }

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
    data: bootcamps
  })
})
