
let features = geojsonFeature; 
    // Create a map object
    var myMap = L.map("mapid", {
        center: [41.850033, -87.6500523],
        zoom: 4
    });
    L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
    }).addTo(myMap);
    features.forEach(feature => { 
        var lat = feature.geometry.coordinates[0];
        var long = feature.geometry.coordinates[1];
        var cord = [long, lat]; 
        color_orange = 'rgb(250,110,50)';
        color_blue = 'rgb(10,60,80)';
        color_grey = 'rgb(90,90,90)';  
        L.circle(cord, {
            fillOpacity: 0.75,
            color: "white",
            fillColor: color_orange,
            // Adjust radius
            radius: 2 * 70000
        }).bindPopup(`<h3>${feature.properties.Address}</h3><hr>${new Date(feature.properties.Name)}`).addTo(myMap);
    });


// Grab the data with d3
// d3.ATMs.js(Locations, function(response) {

//   console.log(response);
//   // Create a new marker cluster group
//   var markers = L.markerClusterGroup();

//   // Loop through data
//   for (var i = 0; i < response.length; i++) {

//     // Set the data location property to a variable
//     var lat = response[i].Latitude;
//     var lng = response[i].Longitude;

//     console.log(lat);
//     console.log(lng);


//     // Add a new marker to the cluster group and bind a pop-up
//     if(lat && lng) {
//       markers.addLayer(L.marker([lat, lng])
//         .bindPopup("<h1 style='text-align:center;'>" + response[i].Name + "</h1> <hr> <h2 style='text-align:center;'>" + response[i].Address + "</h2>"));
//     }

//   }

//   // Add our marker cluster layer to the map
//   myMap.addLayer(markers);

// });
