var operations = require('./operations')
var mongoose = require('mongoose')

exports.initialize = (socket, io) => {
    socket.on('request-for-help', function(eventData){
        var requestTime = new Date()
        var requestId = mongoose.Types.ObjectId()
        var location = {
            coordinates: [
                eventData.location.longitude,
                eventData.location.latitude
            ],
            address: eventData.location.address
        }
        var requestDetails = {};
        requestDetails.requestId = requestId;
        requestDetails.location = location;
        requestDetails.requestTime = requestTime;
        requestDetails.citizenId = eventData.citizenId;
        requestDetails.status = "waiting";
        operations.saveRequests(requestDetails, function(results){
            operations.fetchNearest(location.coordinates, function(results){
                eventData.requestId = requestId;
                for(var i=0; i< results.length; i++){
                    io.sockets.in(results[i].userId).emit('request-for-help', eventData)
                }
            })
        })
    })
    
    socket.on('request-accepted', (eventData) => {
        var requestId = mongoose.Types.ObjectId(eventData.requestDetails.requestId)
        var acceptedRequest = {};
        acceptedRequest.requestId = requestId;
        acceptedRequest.copId = eventData.copDetails.userId;
        acceptedRequest.status = "engaged";
        operations.updateRequest(acceptedRequest, function(results){
            io.sockets.in(eventData.requestDetails.citizenId).emit('request-accepted', eventData.copDetails)
        })
        // console.log(requestId)
    })

    socket.on('update-location', (eventData) => {
        io.sockets.in(eventData.requestDetails.citizenId).emit('update-location', eventData.updatedLocation)
    })
}