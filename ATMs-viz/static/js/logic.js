
// Creating map object
var myMap = L.map("map", {
  center: [37.697, -97.314],
  zoom: 5
});

// Adding tile layer to the map
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);


// For now we will use this static file, dumped from the mySQL db
// In subsequent iterations, we will have the file dumped from the db, and then pass it to
// the program.
// I imported a zip-code-to-latlng file so that we can make the maps dynamically

url = 'ATMs.json'

// Grab the data with d3
d3.json(url, function(response) {

  console.log(response);
  // Create a new marker cluster group
  var markers = L.markerClusterGroup();

  // Loop through data
  for (var i = 0; i < response.length; i++) {

    // Set the data location property to a variable
    var lat = response[i].lat;
    var lng = response[i].lng;

    console.log(lat);
    console.log(lng);


    // Add a new marker to the cluster group and bind a pop-up
    if(lat && lng) {
      markers.addLayer(L.marker([lat, lng])
        .bindPopup("<h1 style='text-align:center;'>" + response[i].username + "</h1> <hr> <h2 style='text-align:center;'>" + response[i].services + "</h2>"));
    }

  }

  // Add our marker cluster layer to the map
  myMap.addLayer(markers);

});
