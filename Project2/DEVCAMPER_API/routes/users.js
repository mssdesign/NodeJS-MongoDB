const express = require('express')
const {
  getUsers,
  getUser,
  createUser,
  deleteUser,
  updateUser,
} = require('../controllers/users')
const User = require('../models/User')
const advancedResults = require('../middleware/advancedResults')
const router = express.Router({ mergeParams: true })
const { protect, authorize } = require('../middleware/auth')

//Adicionando protect e authorize em todas as rotas abaixo
router.use(protect)
router.use(authorize('admin'))

router.route('/').get(advancedResults(User), getUsers).post(createUser)

router.route('/:id').get(getUser).put(updateUser).delete(deleteUser)

module.exports = router
