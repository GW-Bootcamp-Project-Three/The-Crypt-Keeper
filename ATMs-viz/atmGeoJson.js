//Query URL
//var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
 
var geojsonFeature = 
[
{
    "type": "Feature",
    "properties": {
        "Name": "J Mart Gas",
        "Hours": "Mon-Sun: 5:00am - 10:00pm",
        "Address": "210 W Elm St, Tuscaloosa, AL, 35401",
        "Street": "210 W Elm St",
        "City": "Tuscaloosa",
        "State": "AL",
        "ZipCode": "35401",
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-87.57034890000001, 33.1866468]
    }
},
{
    "type": "Feature",
    "properties": {
        "Name": "Pride Food Mart",
        "Hours": "24/7",
        "Address": "1734 E Apache Blvd., Tucson, AZ, 85712",
        "Street": "1734 E Apache Blvd.",
        "City": "Tucson",
        "State": "AZ",
        "ZipCode": "85712",
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-111.9096244, 33.4152126]
    }
},
{
    "type": "Feature",
    "properties": {
        "Name": "ARCO",
        "Hours": "24/7",
        "Address": "8021 California Ave, Wilmington, CA, 90744",
        "Street": "8021 California Ave",
        "City": "Wilmington",
        "State": "CA",
        "ZipCode": "90744",
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-118.1816731, 33.8435226]
    }
},
{
    "type": "Feature",
    "properties": {
        "Name": "Lucky Mart",
        "Hours": "Mon-Sun: 8:00am - 10:00pm",
        "Address": "286 Southampton Rd, Worcester, MA, 01063",
        "Street": "286 Southampton Rd",
        "City": "Worcester",
        "State": "MA",
        "ZipCode": "01063",
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-72.72925049999999, 42.1481733]
    }
} 
]; 
/* WE"LL GET FEATURES FROM JSON LATER   
d3.json(queryUrl).then(data => {    
}); 
*/
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
 
