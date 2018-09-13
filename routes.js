var operations = require('./operations')

function initialize(app, db, socket, io) {
    // '/cops?lat=12.9718915&&lng=77.64115449999997'
    app.get('/cops', function(req, res) {
        
        var latitude = Number(req.query.lat);
        var longitude = Number(req.query.lng);
        operations.fetchNearestCops(db, [longitude, latitude], function(results) {
            res.json({
                cops: results
            });
        });
    });

    app.get('/cops/info', (req, res) => {
        var userId = req.query.userId
        operations.fetchCopDetails(db, userId, (results) => {
            res.json({
                copDetails: results
            })
        })
    })

    socket.on('request-for-help', function(eventData) {
        var requestTime = new Date(); //Time of the request

        var ObjectID = require('mongodb').ObjectID;
        var requestId = new ObjectID; //Generate unique ID for the request

        //1. First save the request details inside a table requestsData.
        //Convert latitude and longitude to [longitude, latitude]
        var location = {
            coordinates: [
                eventData.location.longitude, 
                eventData.location.latitude
            ],
            address: eventData.location.address
        };
        operations.saveRequest(db, requestId, requestTime, location, eventData.citizenId, 'waiting', function(results) {

            //2. AFTER saving, fetch nearby cops from citizen’s location
            operations.fetchNearestCops(db, location.coordinates, function(results) {
                eventData.requestId = requestId;
                //3. After fetching nearest cops, fire a 'request-for-help' event to each of them
                for (var i = 0; i < results.length; i++) {
                    io.sockets.in(results[i].userId).emit('request-for-help', eventData);
                }
            });
        });
    });

    socket.on('request-accepted', (eventData) => {
        var ObjectID = require('mongodb').ObjectID
        var requestId = new ObjectID(eventData.requestDetails.requestId)

        operations.updateRequest(db, requestId, eventData.copDetails.copId, 'engaged', (results) => {
            io.sockets.in(eventData.requestDetails.citizenId).emit('request-accepted', eventData.copDetails)
        })
    })
    app.get('/requests/info', function(req, res) {
        operations.fetchRequests(db, function(results) {
            var features = [];
            for (var i = 0; i < results.length; i++) {
                features.push({
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: results[i].location.coordinates
                    },
                    properties: {
                        status: results[i].status,
                        requestTime: results[i].requestTime,
                        address: results[i].location.address
                    }
                })
            }
            var geoJsonData = {
                type: 'FeatureCollection',
                features: features
            }

            res.json(geoJsonData);
        });
    });
}
exports.initialize = initialize;