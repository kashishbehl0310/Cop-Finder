const mongoose = require('mongoose')

require('dotenv').config({path: 'variables.env'})

mongoose.connect(process.env.DATABASE)
mongoose.Promise = global.Promise
mongoose.connection.on('error', (err) => {
    console.log(`Error connecting to database ${err.message}`)
})
mongoose.connection.on('connected', function(){
    console.log('connected')
})

require('./models/cop')

const app = require('./app')
const routes = require('./routes/index')
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const port = process.env.PORT || 7777;
server.listen(port, () => {
    console.log(`App listening on port ${port}`)
    io.on('connection', (socket) => {
        console.log('A user just connected')
        socket.on('join', (data) => {
            socket.join(data.userId)
            console.log(`User connected with id ${data.userId}`)
        })
        
    })
})