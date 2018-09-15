var http = require("http");
var express = require("express");
var consolidate = require("consolidate");//1
var _ = require("underscore");
var bodyParser = require('body-parser');
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
// var routes = require('./routes'); //File that contains our endpoints
// var mongoClient = require("mongodb").MongoClient;

var app = express();
app.use(bodyParser.urlencoded({
    extended: true,
}));

app.use(bodyParser.json({limit: '5mb'}));

app.set('views', 'views'); //Set the folder-name from where you serve the html page. 
app.use(express.static('./public')); //setting the folder name (public) where all the static files like css, js, images etc are made available

app.set('view engine','html');
app.engine('html',consolidate.underscore);

const routes = require('./routes/index')
app.use('/', routes)
const initialize = require('./helpers/initializer')

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
        initialize.initialize(socket, io)
    })
})
// server.listen(portNumber, () => {
//     console.log(`Server listening on port ${portNumber}`)
//     var url = 'mongodb://localhost:27017/copFinder'
//     mongoClient.connect(url, (err, db) => {
//         console.log('Database connected')
//         app.get('/cop.html', (req, res) => {
//             console.log(`aaaaa ${req.query.userId}`)
//             res.render('cop', {
//                 userId: req.query.userId
//             })
//         })
//         app.get('/citizen.html', (req, res) => {
//             res.render('citizen', {
//                 userId: req.query.userId
//             })
//         })

//         app.get('/data.html', function(req, res) {
//             res.render('data.html');
//         });

//         // io.on('connection', (socket) => {
//         //     // console.log('A user just connected')
//         //     socket.on('join', (data) => {
//         //         socket.join(data.userId)
//         //         console.log(`user joined with id ${data.userId}`)
//         //     })
//         //     routes.initialize(app, db, socket, io)
//         // })
//     })
// })

module.exports = app