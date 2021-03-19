// // var myMap = L.map("map", {
// //     center: [39.8283, -98.5795],
// //     zoom: 5
// // });

// // var markers = L.markerClusterGroup({
// //     spiderfyOnMaxZoom: true,
// //     showCoverageOnHover: true,
// //     zoomToBoundsOnClick: true
// // });

  
// // // Adding tile layer to the map
// // L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
// // attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
// // tileSize: 512,
// // zoomOffset: -1,
// // id: "mapbox/streets-v11",
// // accessToken: API_KEY
// // }).addTo(myMap);


// // d3.json("/static/js/ATMdata.Json", function (data) {
// //     // console.log(data);
// //     data.forEach(feature => {

// //         var geometry = feature.geometry;
// //         var lng = geometry.coordinates[0];
// //         var lat = geometry.coordinates[1];
// //         //var title = Properties.Name;
// //         var marker = L.marker([lat, lng]);
// //         console.log([lat, lng]);

// //         marker.bindPopup(`<h3>${feature.Properties.Address}</h3><hr>${(feature.Properties.Name)}<hr>${(feature.Properties.Hours)}`);

// //         markers.addLayer(marker);

// //     })

// //     markers.addTo(myMap);

// // });






// var map;
// var markers = L.markerClusterGroup({
//     showSpiderfyOnMaxZoom: true,
//     zoomToBoundsOnClick: true,
//     maxClusterRadius: 10
// });

// d3.json("/static/js/ATMdata.Json", function (data) {
//     // console.log(data);
//     do_map(data);

//     document.getElementById('stateFilterSearchButton').addEventListener('click', function () {
//         var searchedState = document.getElementById('stateFilterInput').value;
//         filterAndReAddMarkers(data, searchedState)
//     });
// });

// function addMarkers(data, map, stateForFiltering) {
//     for (var i = 0; i < data.length; i++) {
//         var feature = data[i]
//         var Properties = feature.Properties;
//         var state= Properties['State'];

//         if (stateForFiltering && stateForFiltering !== state) {
//             continue;
//         }
// // filter edit
//         var geometry = feature.geometry;
//         var lng = geometry.coordinates[0];
//         var lat = geometry.coordinates[1];
//         var title = Properties.Name;
//         var marker = L.marker(new L.LatLng(lat, lng), { title: title });
//         color_orange = 'rgb(250,110,50)';
//         color_blue = 'rgb(10,60,80)';
//         color_grey = 'rgb(90,90,90)';
        
//         marker.bindPopup(`<h3>${feature.Properties.Address}</h3><hr>${(feature.Properties.Name)}<hr>${(feature.Properties.Hours)}`);

//         markers.addLayer(marker);
//     }
//     map.scrollWheelZoom.disable();
//     map.addLayer(markers);
    
   
// }

// function filterAndReAddMarkers(data, searchedState) {
//     markers.clearLayers();
//     addMarkers(data, map, searchedState);
    
// }
// // // Creating map object
// // var myMap = L.map("map", {
// //     center: [37.697, -97.314],
// //     zoom: 5
// //   });
// //   ​
// //   // Adding tile layer to the map
// //   L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
// //     attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
// //     tileSize: 512,
// //     maxZoom: 18,
// //     zoomOffset: -1,
// //     id: "mapbox/streets-v11",
// //     accessToken: API_KEY
// //   }).addTo(myMap);

// function do_map(data, stateForFiltering = null) {
//     var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//         //maxZoom: 5,
//         attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Points &copy 2012 LINZ'
//     }),
//         latlng = L.latLng(37.697, -97.314);

//     map = L.map('map', { center: latlng, zoom: 5, layers: [tiles] });
//     map.scrollWheelZoom.disable();
//     addMarkers(data, map);
    
// }

var myMap = L.map("map", {
    center: [37.697, -97.314],
    zoom:4
  });
  
  // Adding tile layer to the map
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken:'pk.eyJ1Ijoid2pwYXBwYXMiLCJhIjoiY2traGpneHM1MDBqOTJ3cW5yODI5emUxNSJ9.N1ijsLc2UYQvliuaFtrRPw'
  }).addTo(myMap);
  
  var gIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
  
  url = 'ATMdata.json'
    
  // Grab the data with d3
  d3.json(url, function(response) {
  
    // console.log(response);

    var markers = L.markerClusterGroup();
  
    resp = Object.values(response);
    console.log(resp);
  
    // Loop through data
    for (var i = 0; i < resp.length; i++) {
  
      
      // Set the data location property to a variable
      var lat = resp[i].Latitude;
      var lng = resp[i].Longitude;

      if(lat && lng) {
        markers.addLayer(L.marker([lat, lng],{icon: gIcon})
        .bindPopup(`<h3>${resp[i].Address}</h3><hr>${(resp[i].Name)}<hr>${(resp[i].Hours)}`));
      }
  
    //   console.log([lat, lng]);
  
    // Add our marker cluster layer to the map
    myMap.addLayer(markers);
  
  }});