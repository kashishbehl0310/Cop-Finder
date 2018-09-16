const mongoose = require('mongoose')
const cops = mongoose.model('cops')
const requests = mongoose.model('requests')

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

exports.saveRequests = (requestDetails, callback) => {
    const newRequest = new requests({
        _id: requestDetails.requestId,
        location: requestDetails.location,
        requestTime: requestDetails.requestTime,
        citizenId: requestDetails.citizenId,
        status: requestDetails.status
    })
    newRequest.save((err, results) => {
        if(err){
            console.log(err)
        }else{
            console.log("success")
            callback(results)
        }
    })
}