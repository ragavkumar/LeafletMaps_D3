// Create a map object
var myMap = L.map("map", {
  center: [37.0902, -95.7129],
  zoom: 4
});

// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18, //cannpt zoom more than 18
  id: "mapbox.streets-basic",
  accessToken: API_KEY
}).addTo(myMap);

// Link to GeoJSON
var APILink = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
// var APILink = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson"

function getColor(d) {
  return d > 5 ? '#FF0000' :
         d > 4 ? '#FF6600' :
         d > 3 ? '#FFCC00' :
         d > 2 ? '#CCFF00' :
         d > 1 ? '#66FF00' :
                 '#00FF00';
};

var legend = L.control({position: 'bottomright'});
legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        mag_scale = [0, 1, 2, 3, 4, 5],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < mag_scale.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(mag_scale[i] + 1) + '"></i> ' +
            mag_scale[i] + (mag_scale[i + 1] ? '&ndash;' + mag_scale[i + 1] + '<br>' : '+');
    }
    return div;
};
legend.addTo(myMap);

// Loop through the countries array
d3.json(APILink, function(data){
  var features_level = data.features;

    for (var i=0; i<features_level.length; i++){
      var recording = features_level[i];
      var lat = recording.geometry.coordinates[1];
      var long = recording.geometry.coordinates[0];
      var magnitude = recording.properties.mag;
      var place = recording.properties.place;
      var date = new Date(recording.properties.time);

      var circle_obj = L.circle([lat, long],
        {
        fillColor:getColor(magnitude), 
        radius: 25000*magnitude, 
        color: "#696969",
        fillOpacity:0.9,
        weight: 1
        }
        ).bindPopup(
          "<h4>Location: " + place + " </h4> <h4>Date & Time: "+ date + "</h4> <h4>Magnitude: " + magnitude + "</h4>"
          );

      circle_obj.on('mouseover', function (e) {
        e.target.openPopup();
      });

      circle_obj.on('mouseout', function (e) {
        e.target.closePopup();
      });
      
      circle_obj.addTo(myMap);
    }
});
