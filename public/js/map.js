function hello(){
    console.log('file reached')
}

function loadNearest(map, lat, lng){
    axios.get(`/cops?lat=${lat}&&lng=${lng}`)
    .then(res => {
        const cops = res.data.cops;
        if(!cops.length){
            alert('No nearby cops')
            return;
        }
        const bounds = new google.maps.LatLngBounds()
        const infoWindow = new google.maps.InfoWindow()

       const markers = cops.map(cop => {
           const [placeLng, placeLat] = cop.location.coordinates;
           const position = {lat: placeLat, lng: placeLng}
           bounds.extend(position)
           var icon = {
                url: '/images/police.png',
                scaledSize: new google.maps.Size(44, 18)
            }
           const marker = new google.maps.Marker({map, position, icon}) 
           marker.place = cop;
           return marker
       })
        map.setCenter(bounds.getCenter());
        map.fitBounds(bounds);
    }).catch(err => {
        console.log(err)
    })
}

// export default hello;