function loadNearest(map, lat, lng, nearby){
    return axios.get(`/cops?lat=${lat}&&lng=${lng}`)
    .then(res => {
        // console.log(res.data)
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
            nearby.push(marker) 
        })
        map.setCenter(bounds.getCenter());
        map.fitBounds(bounds);
        return nearby
    }).catch(err => {
        console.log(err)
    })
}

function locateCitizen(map, requestDetails, markers){
    const position = {lat: requestDetails.location.latitude, lng: requestDetails.location.longitude}
    const icon = {
        url: '/images/citizen.png',
        scaledSize: new google.maps.Size(50, 50)
    }
    const marker = new google.maps.Marker({map, position, icon})
    marker.place = requestDetails
    markers.push(marker)
    console.log(markers)
    setRoute(markers)
}
// export default hello;

function setRoute(markers){
    console.log(markers.length)
}

function locateHelp(map, copDetails){
    const position = {lat: copDetails.location.latitude, lng: copDetails.location.longitude}
    const icon = {
        url: "/images/police.png",
        scaledSize: new google.maps.Size(44, 18)
    }
    marker = new google.maps.Marker({map, position, icon})
    marker.setMap(map)
    socket.on('update-location', function(eventData){
        var latlng = new google.maps.LatLng(eventData.latitude, eventData.longitude)
        marker.setPosition(latlng)  
    })
    // marker.place = copDetails
    return marker
    // return helpMarker
}