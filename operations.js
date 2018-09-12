function fetchNearestCops(db, coordinates, callback) {

    db.collection("PoliceData").createIndex({
        "location": "2dsphere"
    }, function() {
        db.collection("PoliceData").find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: coordinates
                    },
                    $maxDistance: 2000
                }
            }
        }).toArray(function(err, results) {
            if (err) {
                console.log(err)
            } else {
                callback(results);
            }
        });
    });
}

function fetchCopDetails(db, userId, callback){
    db.collection("PoliceData").findOne({
        userId: userId
    }, (err, results) => {
        if(err){
            console.log(err)
        }else{
            callback({
                copId: results.userId,
                displayName: results.displayName,
                phone: results.phone,
                location: results.location
            })
        }
    })
}

function saveRequest(db, issueId, requestTime, location, citizenId, status, callback){
    db.collection('requestData').insert({
        "_id": issueId,
        "requestTime": requestTime,
        "location": location,
        "citizenId": citizenId,
        "status": status
    }, (err, results) => {
        if(err){
            console.log(err)
        }else{
            callback(results)
        }
    })
}

function updateRequest(db, requestId, copId, status, callback){
    db.collection('requestData').update({
        "_id": requestId
    },{
        $set: {
            "status": status,
            "copId": copId
        }
    }, (err, results) => {
        if(err){
            console.log(err)
        }else{
            callback("Issue updated")
        }
    })
}

function fetchRequest(db, callback){
    var collection = db.collection('requestData')
    var stream = collection.find({}, {
        requestTime: true,
        status: true,
        location: true
    }).stream()
}

exports.fetchNearestCops = fetchNearestCops
exports.fetchCopDetails = fetchCopDetails
exports.saveRequest = saveRequest
exports.updateRequest = updateRequest