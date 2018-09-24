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
    setRoute(markers, map)
}
// export default hello;

function setRoute(markers, map){
    var lat_lng = new Array()
    var latlngBounds = new google.maps.LatLngBounds()
    for(var i=0; i< markers.length; i++){
        var data = markers[i]
        var myLatLng = new google.maps.LatLng(data.place.location.latitude, data.place.location.longitude)
        lat_lng.push(myLatLng)
    }
    var path = new google.maps.MVCArray()
    var service = new google.maps.DirectionsService()
    var poly = new google.maps.Polyline({map, strokeColor: '#4986E7'})
    for(var i=0; i< lat_lng.length; i++){
        if((i + 1) < lat_lng.length){
            var src = lat_lng[i]
            var des = lat_lng[i+1]
            path.push(src)
            poly.setPath(path)
            service.route({
                origin: src,
                destination: des,
                travelMode: google.maps.DirectionsTravelMode.DRIVING
            }, function(result, status){
                if(status == google.maps.DirectionsStatus.OK){
                    for(var i=0, len = result.routes[0].overview_path.length; i< len; i ++){
                        path.push(result.routes[0].overview_path[i])
                    }
                }else{
                    console.log("error")
                }
            })
        }
    }
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