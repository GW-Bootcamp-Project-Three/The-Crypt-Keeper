var map;
var markers = L.markerClusterGroup();

d3.json("/static/js/ATMdata.json", function (data) {
    //console.log(data);
    do_map(data);

    document.getElementById('zipCodeFilterSearchButton').addEventListener('click', function () {
        var searchedZipCode = document.getElementById('zipCodeFilterInput').value;
        filterAndReAddMarkers(data, searchedZipCode)
    });
});

function addMarkers(data, map, zipCodeForFiltering) {
    for (var i = 0; i < data.length; i++) {
        var feature = data[i]
        var Properties = feature.Properties;
        var zipCode = Properties['Zip Code'];

        if (zipCodeForFiltering && zipCodeForFiltering !== zipCode) {
            continue;
        }

        var geometry = feature.geometry;
        var lng = geometry.coordinates[0];
        var lat = geometry.coordinates[1];
        var title = Properties.Name;
        var marker = L.marker(new L.LatLng(lat, lng), { title: title });
        color_orange = 'rgb(250,110,50)';
        color_blue = 'rgb(10,60,80)';
        color_grey = 'rgb(90,90,90)';
        marker
            .bindPopup(`<h3>${feature.Properties.Address}</h3><hr>${(feature.Properties.Name)}<hr>${(feature.Properties.Hours)}`);

        markers.addLayer(marker);
    }
    map.scrollWheelZoom.disable();
    map.addLayer(markers);
    
   
}

function filterAndReAddMarkers(data, searchedZipCode) {
    markers.clearLayers();
    addMarkers(data, map, searchedZipCode);
    
}

function do_map(data, zipCodeForFiltering = null) {
    var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 5,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Points &copy 2012 LINZ'
    }),
        latlng = L.latLng(37.697, -97.314);

    map = L.map('map', { center: latlng, zoom: 6, layers: [tiles] });
    map.scrollWheelZoom.disable();
    addMarkers(data, map);
    
}

