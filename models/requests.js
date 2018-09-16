const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const requestSchema = new mongoose.Schema({
    requestTime: {
        type: Date
    },
    location: {
        address: {
            type: String
        },
        coordinates: [{
            type: Number
        }]
    },
    citizenId: {
        type: String
    },
    status: {
        type: String
    },
    copId: {
        type: String
    }
})

module.exports = mongoose.model('requests', requestSchema)