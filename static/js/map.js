var myMap = L.map("map", {
    center: [37.697, -97.314],
    zoom: 5
  });
  
  // Adding tile layer to the map
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY,
  }).addTo(myMap);
  
  var gIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
  
  url = '/static/js/ATMdata.json'
    
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
      // Add our marker cluster layer to the map
  
  }});