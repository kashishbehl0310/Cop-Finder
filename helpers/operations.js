const mongoose = require('mongoose')
const cops = mongoose.model('cops')

exports.fetchNearest = (coordinates, callback) => {
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
    cops.find(q, (err, results) => {
        if(err){
            console.log(err)
        }else{
            callback(results)
        }
    })
}