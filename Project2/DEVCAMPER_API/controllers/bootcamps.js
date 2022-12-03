const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Bootcamp = require('../models/Bootcamp')
const geocoder = require('../utils/geocoder')
const path = require('path')

// @desc Get all bootcamps
// @route   GET /api/v1/bootcamps
// @acess    Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults)
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

  next()
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

  bootcamp.remove() //Aciona o middleware pois o "findByIdAndDelete" não aciona

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

// @desc upload photo for bootcamps
// @route   PUT /api/v1/bootcamps/:id
// @acess    Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id)

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    )
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400))
  }

  const file = req.files.file

  //Make sure the image is a photo
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload an image file`, 400))
  }

  //Check file size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    )
  }

  //Create custom filename
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.log(err)
      return next(new ErrorResponse(`Problem with file upload`, 500))
    }

    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name })

    res.status(200).json({
      success: true,
      data: file.name,
    })
  })
})
