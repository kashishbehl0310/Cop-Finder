var operations = require('./operations')

exports.initialize = (socket, io) => {
    socket.on('request-for-help', function(eventData){
        var requestTime = new Date()
        var location = {
            coordinates: [
                eventData.location.longitude,
                eventData.location.latitude
            ],
            address: eventData.location.address
        }
        operations.fetchNearest(location.coordinates, function(results){
            for(var i=0; i< results.length; i++){
                io.sockets.in(results[i].userId).emit('request-for-help', eventData)
            }
        })
    })
}