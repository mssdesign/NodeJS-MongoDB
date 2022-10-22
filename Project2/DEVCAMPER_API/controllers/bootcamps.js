//Criação de rotas

// @desc Get all bootcamps
// @route   GET /api/v1/bootcamps
// @acess    Public
exports.getBootcamps = (req, res, next) => {
    res.status(200).json({ sucess: true, msg: 'Show all bootcamps' });
}

// @desc Get single bootcamp
// @route   GET /api/v1/bootcamps/:id
// @acess    Public
exports.getBootcamp = (req, res, next) => {
    res.status(200).json({ sucess: true, msg: `Show bootcamp ${req.params.id}` });
}

// @desc create new bootcamp
// @route   POST /api/v1/bootcamps
// @acess    Private (tem que mandar token)
exports.createBootcamp = (req, res, next) => {
    res.status(200).json({ sucess: true, msg: 'Create new bootcamps' });
}

// @desc create new bootcamps
// @route   PUT /api/v1/bootcamps/:id
// @acess    Private (tem que mandar token)
exports.updateBootcamp = (req, res, next) => {
    res.status(200).json({ sucess: true, msg: `Update bootcamps ${req.params.id}` });
}

// @desc create Delete bootcamps
// @route   DELETE /api/v1/bootcamps/:id
// @acess    Private (tem que mandar token)
exports.deleteBootcamp = (req, res, next) => {
    res.status(200).json({ sucess: true, msg: `Delete bootcamp ${req.params.id}` });
}