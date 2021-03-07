

d3.json("static/js/ATM.json", function(data) {
    //console.log(data);
    do_map(data);
});
var markers = L.markerClusterGroup();
function do_map(data){
    geojsonFeature=data;
    // Create a map object
    var myMap = L.map("map", {
        center: [37.697, -97.314],
        zoom: 7
    });
    L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
    }).addTo(myMap);

    geojsonFeature.forEach(feature => { 
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
            radius: 2 * 7000
    }).bindPopup(`<h3>${feature.Properties.Address}</h3><hr>${(feature.Properties.Name)}<hr>${(feature.Properties.Hours)}`).addTo(myMap);
    myMap.addLayer(markers);
});


}
  