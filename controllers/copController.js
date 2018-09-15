const mongoose = require('mongoose')
const cops = mongoose.model('cops')

exports.fetchNearestCop = (req, res) => {
    var lat = req.query.lat;
    var lng = req.query.lng;
    const coordinates = [lng, lat];
    const q = {
        location: {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates
                },
                $maxDistance: 3000
            }
        }
    }
    cops.find(q, (err, data) => {
        if(err){
            console.log(err)
        }else{
            res.json(data)
        }
    })
}

exports.fetchCopDetails = async(req, res) => {
    var userId = req.query.userId;
   cops.findOne({userId: userId}, (err, results) => {
       if(err){
           console.log(err)
       }else{
           res.json({
               copDetails: results
            })
       }
   })
}

exports.copPage = (req, res) => {
    var userId = req.query.userId;
    res.render('cop', {
        userId
    })
} 

exports.citizenPage = (req, res) => {
    var userId = req.query.userId;
    res.render('citizen',{
        userId
    })
}