const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const copSchema = new mongoose.Schema({
    userId: {
        type: String
    },
    phone: {
        type: String,
        required: 'Please enter a number'
    },
    email: {
        type: String
    },
    earnedRatings: {
        type: Number
    },
    totalRatings: {
        type: Number
    },
    location: {
        type: {
            type: String,
            default: 'Point'
        },
        address: {
            type: String
        },
        coordinates: [{
            type: Number
        }]
    }
})

copSchema.index({
    location: '2dsphere'
})

module.exports = mongoose.model('cops', copSchema)