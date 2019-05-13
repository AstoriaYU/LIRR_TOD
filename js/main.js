//mapboxgl.accessToken = 'pk.eyJ1IjoiYXN0b3JpYSIsImEiOiJjanZqbm94N3cwaWgyNDlvOWhpaWJrc3owIn0.RBvVfydPk7Zz_RaT13DmPw';

//Map creation
var map = L.map('map', {}).setView([40.820666, -73.129100], 10);
var baselayer = L.esri.basemapLayer('Gray').addTo(map);
var layerLabels;

//Add baseLayers to map as control layers
function setBasemap(basemap) {
  if (baselayer) {
    map.removeLayer(baselayer);
  }

  baselayer = L.esri.basemapLayer(basemap);

  map.addLayer(baselayer);

  if (layerLabels) {
    map.removeLayer(layerLabels);
  }

  if (basemap === 'ShadedRelief' ||
    basemap === 'Oceans' ||
    basemap === 'Gray' ||
    basemap === 'DarkGray' ||
    basemap === 'Terrain'
  ) {
    layerLabels = L.esri.basemapLayer(basemap + 'Labels');
    map.addLayer(layerLabels);
  } else if (basemap.includes('Imagery')) {
    layerLabels = L.esri.basemapLayer('ImageryLabels');
    map.addLayer(layerLabels);
  }
}

function changeBasemap(basemaps) {
  var basemap = basemaps.value;
  setBasemap(basemap);
}

//add legend for TOD score
var legend = L.control({
  position: 'bottomright'
});

legend.onAdd = function(map) {
  var div =  L.DomUtil.create('div', 'info legend'),
    grades = [0, 8.64, 14.39, 20.83, 100],
    labels = [];

    div.innerHTML += '<b>TOD Score</b><br>';  // don't forget the break tag

  // loop through our density intervals and generate a label with a colored square for each interval
  for (var i = 0; i < grades.length - 1; i++) {
    div.innerHTML +=
      '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
      grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }

  return div;
};

legend.addTo(map);


// //draw polygon to filter stations
// var myFeatures = new L.FeatureGroup();
// var searchwhthin;
// map.addLayer(myFeatures);
// var ptsWithin = [];
// var points = turf.points([stationGeoJson.features[0].geometry.coordinates,stationGeoJson.features[1].geometry.coordinates]);
// var drawControl = new L.Control.Draw({
//   draw: {
//     polyline: false,
//     polygon: true,
//     circle: false,
//     circlemarker: false,
//     marker: false,
//     rectangle: true,
//   }
// });
//
// map.addControl(drawControl);
// // Event which is run every time Leaflet draw creates a new layer
// map.on("draw:created", function (n) {
// //   if(myFeatures) {
// //   map.removeLayer(myFeatures);
// // }
//   var type = n.layerType; // The type of shape
//   var layerdraw = n.layer; // The Leaflet layer for the shape
//   var id = L.stamp(layerdraw); // The unique Leaflet ID for the layer
//   layerdraw.addTo(myFeatures);
//   if (myFeatures.getLayers().length === 1){
//   console.log(id);
// }
//   searchwithin = turf.polygon(myFeatures.toGeoJSON());
//   console.log(searchwithin);
//   myFeatures=L.geoJSON(searchwithin);
//   ptsWithin = turf.pointsWithinPolygon(points, searchwithin);
// //   pointsWithinLayer=L.geoJSON(ptsWithin);
// // pointsWithinLayer.addTo(map);
//  console.log(ptsWithin);
// });

window.onload = function() {
  $('#myModal').appendTo("body");
  new SimpleBar(document.getElementById('sidebar'));
  new SimpleBar(document.getElementById('modal-content'));
  $("#chartContainer").CanvasJSChart({
    animationEnabled: true,
    backgroundColor: "#eee",
    title: {
      text: "Weights of criteria"
    },
    data: [{
      type: "bar",
      toolTipContent: "{label}: weight {y}",
      dataPoints: [{
          label: "Walkability",
          y: 0.02,
        },
        {
          label: "Intensity",
          y: 0.03
        },
        {
          label: "Travel Time Ratio",
          y: 0.04
        },
        {
          label: "Available Land",
          y: 0.05
        },
        {
          label: "Residential Market",
          y: 0.06
        },
        {
          label: "Non-Car Commuters",
          y: 0.07
        },
        {
          label: "Development Activity",
          y: 0.09
        },
        {
          label: "TCI",
          y: 0.12
        },
        {
          label: "Non-Car Ownership",
          y: 0.13
        },
        {
          label: "Economy",
          y: 0.19
        },
        {
          label: "Job Access",
          y: 0.20
        }
      ],
      backgroundColor: ["#400711", "#F28888", "#F23847", "#BF3945", "#F2BBBF", "#A64636", "#F67280", "#C06C84", "#A63333", "#BF5656", "#D9918B"],
      borderColor: ["#400711", "#F28888", "#F23847", "#BF3945", "#F2BBBF", "#A64636", "#F67280", "#C06C84", "#A63333", "#BF5656", "#D9918B"]
    }]
  });
};

function getColor(count) {
  return count > 20.83 ? '#581845' :
    count > 14.39 ? '#900C3F' :
    count > 8.64 ? '#C70039' :
    '#FF5733';
}

function pointStyle1(feature, latlng) {
  return L.circleMarker(latlng, {
    stroke: false,
    radius: 5,
    color: getColor(feature.properties.TOD_score),
    fillOpacity: 0.8
  }).bindPopup(feature.properties.stopname);
}

function onEachFeature(feature, layer) {
  layer.on('click', function(e) {
    if (feature.properties) {
      console.log(feature.properties.stopname);
      $('#station').text(feature.properties.stopname);
      $('#route').text(feature.properties.routename);
      $('#street').text(feature.properties.streetname + ", " + feature.properties.County);
      $('#tod').html(feature.properties.TOD_score);
      var data = {
        stopname: feature.properties.stopname,
        Job_Access: feature.properties.job_access,
        Economy: feature.properties.customer_a,
        Noncar_Ownership: feature.properties.HH_0_car,
        Transit_Index: feature.properties.TCI,
        Development: feature.properties.high_dev,
        Noncar_Commuter: feature.properties.WK_0_car,
        Residential: feature.properties.Med_Hval,
        Available_Land: feature.properties.avlb_land,
        TravelTime_Ratio: feature.properties.AT_ratio,
        Intensity: feature.properties.intensity,
        Walkability: feature.properties.walkscore
      };
      console.log(data);
      var div_main = $('<div "style="width: 800px height: 700px"></div>');
      var context = $('<canvas width="800" height="700"></canvas>');
      div_main.append(context);
      var myRadarChart = new Chart(context, {
        animationEnabled: true,
        "type": "radar",
        "data": {
          "labels": [
            "Job_Access",
            "Economy",
            "Noncar_Ownership",
            "Transit_Index",
            "Development",
            "Noncar_Commuter",
            "Residential",
            "Available_Land",
            "TravelTime_Ratio",
            "Intensity",
            "Walkability",
          ],
          "datasets": [{
            "label": data.stopname,
            "data": [
              data.Job_Access,
              data.Economy,
              data.Noncar_Ownership,
              data.Transit_Index,
              data.Development,
              data.Noncar_Commuter,
              data.Residential,
              data.Available_Land,
              data.TravelTime_Ratio,
              data.Intensity,
              data.Walkability
            ],
            options: {
              layout: {
                padding: {
                  left: 20,
                  right: 20,
                  top: 20,
                  bottom: 20
                }
              }
            },
            "fill": true,
            "backgroundColor": '#F2BBBF',
            "borderColor": '#BF3945',
            "pointBackgroundColor": "#BF3945",
            "pointBorderColor": "#F2BBBF",
            "pointHoverBackgroundColor": "#F2BBBF",
            "pointHoverBorderColor": "#BF3945",
          }]
        }
      });
      layer.bindPopup(div_main[0]);
      layer.openPopup();
    }
    map.setView([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], 16);
  });
}

function onEachFeaturesc(feature, layer) {
  layer.bindPopup("<b>"+feature.properties.stopname+"</b>"+ "</br>"+"TOD score: "+feature.properties.TOD_score+"</br>"+
  "<b>"+"Census Info"+"</b>"+
  "</b>"+ "</br>"+"Popolation Density: "+feature.properties.Pop_Den+
  "</b>"+ "</br>"+"Household Density: "+feature.properties.HH_Den+
  "</b>"+ "</br>"+"Med_Age: "+feature.properties.Med_Age+
  "</b>"+ "</br>"+"Percent of Bchelor Degree: "+feature.properties.Pct_Bch+
  "</b>"+ "</br>"+"Unemployment Rate: "+feature.properties.Pct_Unm+
  "</b>"+ "</br>"+"Poverty Rate: "+feature.properties.Pct_Pvr);
  //layer.openPopup();
  layer.on('click', function(e) {
    if (feature.properties) {
      console.log(feature.properties.stopname);
      $('#station').text(feature.properties.stopname);
      $('#route').text(feature.properties.routename);
      $('#street').text(feature.properties.streetname + ", " + feature.properties.County);
      $('#tod').html(feature.properties.TOD_score);
    }
    map.setView([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], 16);
  });
}

function highlight (layer) {
  layer.setStyle({
    weight: 4,
  });
  if (!L.Browser.ie && !L.Browser.opera) {
    layer.bringToFront();
  }
}

function dehighlight (layer) {
  layer.setStyle({
    weight: 1,
  });
  if (!L.Browser.ie && !L.Browser.opera) {
    layer.bringToFront();
  }
}

function onEachFeaturert(feature, layer) {
  layer.on('mouseover', function(e) {
    if (feature.properties) {
      layer.bindPopup("<b>"+feature.properties.routename+"</b>");
      layer.openPopup();
      highlight(e.target);
    }
});
layer.on('mouseout', function(e) {
  if (feature.properties) {
    layer.closePopup();
    dehighlight(e.target);
  }
});
}
var linelayer = L.geoJSON(lineGeoJson, {
  style: function(feature) {
    switch (feature.properties.routename) {
      case 'Babylon':
        return {
          color: "#c11b1b",
          weight: 1,
          opacity: 0.7
        };
      case 'Belmont':
        return {
          color: "#c15d1b",
          weight: 1,
          opacity: 0.7
        };
      case 'City Zone':
        return {
          color: "#bfa918",
          weight: 1,
          opacity: 0.7
        };
      case 'Far Rockaway':
        return {
          color: "#8abf18",
          weight: 1,
          opacity: 0.7
        };
      case 'Hempstead':
        return {
          color: "#36bf18",
          weight: 1,
          opacity: 0.7
        };
      case 'Long Beach':
        return {
          color: "#18bf98",
          weight: 1,
          opacity: 0.7
        };
      case 'Montauk':
        return {
          color: "#18aebf",
          weight: 1,
          opacity: 0.7
        };
      case 'Oyster Bay':
        return {
          color: "#1965c1",
          weight: 1,
          opacity: 0.7
        };
      case 'Port Jefferson':
        return {
          color: "#1619ba",
          weight: 1,
          opacity: 0.7
        };
      case 'Port Washington':
        return {
          color: "#7415af",
          weight: 1,
          opacity: 0.7
        };
      case 'Ronkonkoma':
        return {
          color: "#aa12a3",
          weight: 1,
          opacity: 0.7
        };
      case 'West Hempstead':
        return {
          color: "#a3106d",
          weight: 1,
          opacity: 0.7
        };
    }
  },
  onEachFeature: onEachFeaturert
});

map.addLayer(linelayer);

var layer1 = L.geoJSON(stationGeoJson, {
  pointToLayer: pointStyle1,
  onEachFeature: onEachFeature
});

var layer2 = L.geoJSON(bufferscGeoJson, {
  style: {
    fillcolor: "#a3106d",
    color: "#18aebf",
    opacity: 0.6
  },
  onEachFeature: onEachFeaturesc
});

//census data layer
//poplation density
function popgetColor(d) {
  return d > 59494.89 ? '#ad4708' :
    d > 33992.44 ? '#EB6614' :
    d > 13938.93 ? '#FF8A19' :
    d > 5307.64 ? '#EBA926' :
    '#FFC320';
}

//add legends for Pop_Den data
var legendpop = L.control({
  position: 'bottomleft'
});

legendpop.onAdd = function(map) {
  var div =  L.DomUtil.create('div', 'info legend'),
    grades = [0, 5307.64, 13938.93, 33992.44, 59494.89],
    labels = [];

    div.innerHTML += '<b>POP Density (/sqmi.)</b><br>';  // don't forget the break tag

  // loop through our density intervals and generate a label with a colored square for each interval
  for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
      '<i style="background:' + popgetColor(grades[i] + 1) + '"></i> ' +
      grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }

  return div;
};

function popstyle(feature) {
  return {
    fillColor: popgetColor(feature.properties.Pop_Den),
    weight: 0.4,
    opacity: 0.5,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.4
  };
}

var poplayer = L.geoJSON(blockGeoJson, {
  style: popstyle
});

//household density
function hhgetColor(d) {
  return d > 12343.19 ? '#001a66' :
    d > 6513.98 ? '#0033cc' :
    d > 2547.52 ? '#3366ff' :
    d > 975.92 ? '#809fff' :
    '#b3d1ff';
}

//add legends for HH_Den data
var legendhh = L.control({
  position: 'bottomleft'
});

legendhh.onAdd = function(map) {
  var div =  L.DomUtil.create('div', 'info legend'),
    grades = [0, 975.92, 2547.52, 6513.98, 12343.19],
    labels = [];

    div.innerHTML += '<b>HH Density (/sqmi.)</b><br>';  // don't forget the break tag

  // loop through our density intervals and generate a label with a colored square for each interval
  for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
      '<i style="background:' + hhgetColor(grades[i] + 1) + '"></i> ' +
      grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }

  return div;
};

function hhstyle(feature) {
  return {
    fillColor: hhgetColor(feature.properties.HH_Den),
    weight: 0.4,
    opacity: 0.5,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.5
  };
}

var hhlayer = L.geoJSON(blockGeoJson, {
  style: hhstyle
});

//median age
function agegetColor(d) {
  return d > 46.1 ? '#4d0039' :
    d > 41.1 ? '#800060' :
    d > 36.8 ? '#cc0099' :
    d > 32.8 ? '#ff1ac6' :
    '#ff99e6';
}

//add legends for Med_age data
var legendage = L.control({
  position: 'bottomleft'
});

legendage.onAdd = function(map) {
  var div =  L.DomUtil.create('div', 'info legend'),
    grades = [0, 32.8, 36.8, 41.1, 46.1],
    labels = [];

    div.innerHTML += '<b>Median Age</b><br>';  // don't forget the break tag

  // loop through our density intervals and generate a label with a colored square for each interval
  for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
      '<i style="background:' + agegetColor(grades[i] + 1) + '"></i> ' +
      grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }

  return div;
};

function agestyle(feature) {
  return {
    fillColor: agegetColor(feature.properties.Med_Age),
    weight: 0.4,
    opacity: 0.5,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.3
  };
}

var agelayer = L.geoJSON(blockGeoJson, {
  style: agestyle
});

//percent of Bachelor Degree
function bchgetColor(d) {
  return d > 29.90 ? '#0f3d0f' :
    d > 22.96 ? '#1f7a1f' :
    d > 17.39 ? '#2eb82e' :
    d > 11.75 ? '#5cd65c' :
    '#adebad';
}

//add legends for Pct_Bch data
var legendbch = L.control({
  position: 'bottomleft'
});

legendbch.onAdd = function(map) {
  var div =  L.DomUtil.create('div', 'info legend'),
    grades = [0, 11.75, 17.39, 22.96, 29.90],
    labels = [];

    div.innerHTML += '<b>Pct of Bachelor Degree</b><br>';  // don't forget the break tag

  // loop through our density intervals and generate a label with a colored square for each interval
  for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
      '<i style="background:' + bchgetColor(grades[i] + 1) + '"></i> ' +
      grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }

  return div;
};

function bchstyle(feature) {
  return {
    fillColor: bchgetColor(feature.properties.Pct_Bch),
    weight: 0.4,
    opacity: 0.5,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.4
  };
}
var bchlayer = L.geoJSON(blockGeoJson, {
  style: bchstyle
});

//unemployment rate
function unmgetColor(d) {
  return d > 10.13 ? '#392613' :
    d > 6.77 ? '#604020' :
    d > 4.34 ? '#996633' :
    d > 2.16 ? '#c68c53' :
    '#dfbf9f';
}

//add legends for Pct_Unm data
var legendunm = L.control({
  position: 'bottomleft'
});

legendunm.onAdd = function(map) {
  var div =  L.DomUtil.create('div', 'info legend'),
    grades = [0, 2.16, 4.34, 6.77, 10.13],
    labels = [];

    div.innerHTML += '<b>Unemployment Rate</b><br>';  // don't forget the break tag

  // loop through our density intervals and generate a label with a colored square for each interval
  for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
      '<i style="background:' + unmgetColor(grades[i] + 1) + '"></i> ' +
      grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }

  return div;
};

function unmstyle(feature) {
  return {
    fillColor: unmgetColor(feature.properties.Pct_Unm),
    weight: 0.4,
    opacity: 0.5,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.4
  };
}
var unmlayer = L.geoJSON(blockGeoJson, {
  style: unmstyle
});

//poverty rate
function pvrgetColor(d) {
  return d > 43.01 ? '#4d1933' :
    d > 26.36 ? '#862d59' :
    d > 14.54 ? '#c6538c' :
    d > 5.36 ? '#d98cb3' :
    '#ecc6d9';
}

//add legends for Pct_Pvr data
var legendpvr = L.control({
  position: 'bottomleft'
});

legendpvr.onAdd = function(map) {
  var div =  L.DomUtil.create('div', 'info legend'),
    grades = [0, 5.36, 14.54, 26.36, 43.01],
    labels = [];

    div.innerHTML += '<b>Poverty Rate</b><br>';  // don't forget the break tag

  // loop through our density intervals and generate a label with a colored square for each interval
  for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
      '<i style="background:' + pvrgetColor(grades[i] + 1) + '"></i> ' +
      grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }

  return div;
};

function pvrstyle(feature) {
  return {
    fillColor: pvrgetColor(feature.properties.Pct_Pvr),
    weight: 0.4,
    opacity: 0.5,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.4
  };
}
var pvrlayer = L.geoJSON(blockGeoJson, {
  style: pvrstyle
});

//Add censusLayers to map as control layers
var censuslayer;

function cleancensus() {
  map.removeLayer(layer1);
  map.removeLayer(poplayer);
  map.removeLayer(hhlayer);
  map.removeLayer(agelayer);
  map.removeLayer(bchlayer);
  map.removeLayer(unmlayer);
  map.removeLayer(pvrlayer);
  legendpop.remove();
  legendhh.remove();
  legendage.remove();
  legendbch.remove();
  legendunm.remove();
  legendpvr.remove();
}

function setCensus(censusdat) {
  if (censusdat == "Pop_Den") {
    cleancensus();
    censuslayer = poplayer.addTo(map);
    legendpop.addTo(map);
    layer1.addTo(map);
  } else if (censusdat == "HH_Den") {
    cleancensus();
    censuslayer = hhlayer.addTo(map);
    legendhh.addTo(map);
    layer1.addTo(map);
  } else if (censusdat == "Med_Age") {
    cleancensus();
    censuslayer = agelayer.addTo(map);
    legendage.addTo(map);
    layer1.addTo(map);
  } else if (censusdat == "Pct_Bch") {
    cleancensus();
    censuslayer = bchlayer.addTo(map);
    legendbch.addTo(map);
    layer1.addTo(map);
  } else if (censusdat == "Pct_Unm") {
    cleancensus();
    censuslayer = unmlayer.addTo(map);
    legendunm.addTo(map);
    layer1.addTo(map);
  } else if (censusdat == "Pct_Pvr") {
    cleancensus();
    censuslayer = pvrlayer.addTo(map);
    legendpvr.addTo(map);
    layer1.addTo(map);
  }
  else if (censusdat == "censusnull") {
    cleancensus();
    censuslayer = null;
    layer1.addTo(map);
  }
  map.addLayer(censuslayer);
}

function changeCensus(census) {
  var censusdat = census.value;
  setCensus(censusdat);
}

//build slides
var slides = [{
  text: "Filter stations by a TOD score range:",
  layer: layer1
}];

var currentSlide = 0;

var addText = (text) => {

  $('#numberarea').before(`<p class = "p" id='text'>${text}</p>`);
}

var setLayer = (layer) => {
  layer = layer1
  layer.addTo(map);
  map.on('click', onEachFeature);
};

var numtodlayer = [];


var filterLayer = () => {
  map.removeLayer(layer1);
  map.removeLayer(layer2);
  mintod = $('#numeric-input1').val();
  maxtod = $('#numeric-input2').val();
  numtodlayer = L.geoJson(stationGeoJson, {
    pointToLayer: pointStyle1,
    filter: function(feature, layer) {
      return feature.properties.TOD_score >= mintod && feature.properties.TOD_score <= maxtod;
    },
    onEachFeature: onEachFeature
  });
  numtodlayer.addTo(map);
};

var cleanup = () => {
  map.removeLayer(layer2);
  map.removeLayer(numtodlayer);
  cleancensus();
  map.setView([40.820666, -73.129100], 10);

};

var buildSlide = (slideObject) => {
  addText(slideObject.text);
  setLayer(slideObject.layer);
}

buildSlide(slides[currentSlide]);

var resetSlide = (slideObject) => {
  $('#station').text("");
  $('#route').text("");
  $('#street').text("");
  $('#tod').html("");
  $('#numeric-input1').val("");
  $('#numeric-input2').val("");
  setLayer(slideObject.layer);
}

$("#buffer").click(() => {
  map.removeLayer(layer1);
  layer2.addTo(map);
  layer1.addTo(map);
})

$("#bufferoff").click(() => {
  map.removeLayer(layer2);
})

$("#filter").click(() => {
  cleanup();
  filterLayer();
})

$("#reset").click(() => {
  cleanup();
  resetSlide(slides[currentSlide]);
});
