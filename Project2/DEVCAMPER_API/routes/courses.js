const express = require('express')
const {
  getCourses,
} = require('../controllers/courses')

//mergeParams permite juntar a requisição do bootcamps com o do courses
const router = express.Router({ mergeParams: true })

router.route('/').get(getCourses)

module.exports = router