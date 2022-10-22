const express = require('express')
const router = express.Router();

//Criação de rotas
router.get('/', (req, res) => {
    res.status(200).json({ sucess: true, msg: 'Show all bootcamps' });
})

router.get('/:id', (req, res) => {
    res.status(200).json({ sucess: true, msg: `Show bootcamp ${req.params.id}` });
})

router.post('/', (req, res) => {
    res.status(200).json({ sucess: true, msg: 'Create new bootcamps' });
})

router.put('/:id', (req, res) => {
    res.status(200).json({ sucess: true, msg: `Update bootcamps ${req.params.id}` });
})

router.delete('/:id', (req, res) => {
    res.status(200).json({ sucess: true, msg: `Delete bootcamp ${req.params.id}` });
})

module.exports = router