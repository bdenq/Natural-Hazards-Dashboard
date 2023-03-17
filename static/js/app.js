var map = L.map("map", {
    center: [
      37, -120
    ],
    zoom: 6
  });

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


let qry_url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'
d3.json(qry_url).then(function (data) {
  earthquake_count = data.metadata.count;
  var date = new Date(data.metadata.generated);
  updatedAt = date.toString();
  createMarkers(data,updatedAt,earthquake_count);
});

function createMarkers(earthquakeData,updatedAt,quake_cnt) {
    for (var i =0; i<earthquakeData.features.length; i++){
        lon = earthquakeData.features[i].geometry.coordinates[0];
        lat = earthquakeData.features[i].geometry.coordinates[1];
        depth = earthquakeData.features[i].geometry.coordinates[2];
        var mag = earthquakeData.features[i].properties.mag
        var radius = (depth * mag) * 200

        var color = 'darkred'
        if (depth <= 10 ) {
            color = 'darkgreen'
        }
        else if (depth > 10 && depth <= 30) {
            color = 'lightgreen'
        }
        else if (depth > 30 && depth <= 50) {
            color = 'yellow'
        }
        else if (depth > 50 && depth <= 70) {
            color = 'orange'
        }
        else if (depth > 70 && depth <= 90) {
            color = 'red'
        }

        L.circle([lat, lon], radius, {color: color,opacity:.5}).addTo(map).bindPopup(
        `<h3>${earthquakeData.features[i].properties.place}</h3><hr>
        <h3>mag: ${mag}</h3>
        <h3>depth: ${depth}</h3>
        <p>${new Date(earthquakeData.features[i].properties.time)}</p>`);
    }

    // Create a legend to display information about our map.
    var info = L.control({
        position: "bottomright"
    });

    // When the layer control is added, insert a div with the class of "legend".
    info.onAdd = function () {
        var div = L.DomUtil.create("div", "legend");
        return div;
    };
    // Add the info legend to the map.
    info.addTo(map);

    updateLegend(updatedAt, quake_cnt);
    
}

function updateLegend(updatedAt, earthquake_count) {
    console.log('Updated:')
    console.log(updatedAt)
    document.querySelector(".legend").innerHTML = [
    //   "<h6>Updated: " + updatedAt + "</h6>",
      "<h6>Count: " + earthquake_count + "</h6>",
      "<h6 class='under_10'>'0-10'</h6>",
      "<h6 class='under_30'>'10-20'</h6>",
      "<h6 class='under_50'>'30-50'</h6>",
      "<h6 class='under_70'>'50-70'</h6>",
      "<h6 class='under_90'>'70-90'</h6>",
      "<h6 class='over_90'>'90+'</h6>"
    ].join("");
  }