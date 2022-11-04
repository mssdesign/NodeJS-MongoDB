const Bootcamp = require('../models/Bootcamp')

// @desc Get all bootcamps
// @route   GET /api/v1/bootcamps
// @acess    Public
exports.getBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find()

    res.status(200).json({ sucess: true, data: bootcamps })
  } catch (err) {
    res.status(400).json({ success: false })
  }

  res.status(200).json({ sucess: true, msg: 'Show all bootcamps' })
}

// @desc Get single bootcamp
// @route   GET /api/v1/bootcamps/:id
// @acess    Public
exports.getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id)

    if (!bootcamp) {
      //tratando id que não existe, mas está no formato correto
      return res.status(400).json({ success: false })
    }

    res.status(200).json({ success: true, data: bootcamp })
  } catch (err) {
    res.status(400).json({ success: false })
  }
}

// @desc create new bootcamp
// @route   POST /api/v1/bootcamps
// @acess    Private (tem que mandar token)
exports.createBootcamp = async (req, res, next) => {
  // console.log(req.body)
  // res.status(200).json({ sucess: true, msg: 'Create new bootcamps' });
  try {
    const bootcamp = await Bootcamp.create(req.body)

    res.status(201).json({
      success: true,
      data: bootcamp,
    })
  } catch (err) {
    res.status(400).json({success: false})
  }
}

// @desc create new bootcamps
// @route   PUT /api/v1/bootcamps/:id
// @acess    Private (tem que mandar token)
exports.updateBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ sucess: true, msg: `Update bootcamps ${req.params.id}` })
}

// @desc create Delete bootcamps
// @route   DELETE /api/v1/bootcamps/:id
// @acess    Private (tem que mandar token)
exports.deleteBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ sucess: true, msg: `Delete bootcamp ${req.params.id}` })
}
