const express = require('express')
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
} = require('../controllers/bootcamps')
const router = express.Router()

router.route('/').get(getBootcamps).post(createBootcamp)

router.route('/:id').get(getBootcamp).put(updateBootcamp).delete(deleteBootcamp)

module.exports = router

//Rotas movidas para controllers>bootcamps.js
// router.get('/', (req, res) => {
//     res.status(200).json({ sucess: true, msg: 'Show all bootcamps' });
// })

// router.get('/:id', (req, res) => {
//     res.status(200).json({ sucess: true, msg: `Show bootcamp ${req.params.id}` });
// })

// router.post('/', (req, res) => {
//     res.status(200).json({ sucess: true, msg: 'Create new bootcamps' });
// })

// router.put('/:id', (req, res) => {
//     res.status(200).json({ sucess: true, msg: `Update bootcamps ${req.params.id}` });
// })

// router.delete('/:id', (req, res) => {
//     res.status(200).json({ sucess: true, msg: `Delete bootcamp ${req.params.id}` });
// })
