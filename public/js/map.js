// const axios = require('axios')

function hello(){
    console.log('file reached')
}

function loadNearest(lat, lng){
    axios.get(`/cops?lat=${lat}&&lng=${lng}`)
    .then(res => {
    }).catch(err => {
        console.log('error')
    })
}

// export default hello;