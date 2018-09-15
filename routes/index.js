const express = require('express')
const router = express.Router()
const copController = require('../controllers/copController')
const operations = require('../helpers/operations')

router.get('/cops', (req,res) => {
    var lat = req.query.lat
    var lng = req.query.lng
    var coordinates = [lng, lat]
    operations.fetchNearest(coordinates, (results) => {
        res.json({
            cops: results
        })
    })
})
router.get('/cops/info', copController.fetchCopDetails)
router.get('/cop', copController.copPage)
router.get('/citizen', copController.citizenPage)


module.exports = router