const mongoose = require('mongoose')

require('dotenv').config({path: 'variables.env'})

mongoose.connect(process.env.DATABASE)
mongoose.Promise = global.Promise
mongoose.connection.on('error', (err) => {
    console.log(`Error connecting to database ${err.message}`)
})

const app = require('./app')
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const port = process.env.PORT || 7777;
server.listen(port, () => {
    console.log(`App listening on port ${port}`)
    io.on('connection', (socket) => {
        console.log('A user just connected-start')
    })
})
// app.set('port', process.env.PORT || 7777)
// const server = app.listen(app.get('port'), () => {
//     console.log(`Express running → PORT ${server.address().port}`);
// })