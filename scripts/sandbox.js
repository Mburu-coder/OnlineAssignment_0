"use strict";

var restaurants = L.layerGroup();

var mapboxAttribution = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> Contributors: ' +
			'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Mburu Eileen ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>' ,
		mapboxURL = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWJ1cnVtYnVydSIsImEiOiJja2RlMmRxa2EwcHlvMnRxcXJvcm13dWxqIn0.LVTLGjL-WDQh9LXOvcan7A';

//Creating  base layers and adding the default ones to the map
var grayscale = L.tileLayer(mapboxURL, {id: 'mapbox/light-v9', tileSize: 512, zoomOffset: -1, attribution: mapboxAttribution}),
    streets = L.tileLayer(mapboxURL, {id: 'mapbox/streets-v11', tileSize: 512, zoomOffset: -1, attribution: mapboxAttribution}),
    OpenStreetMap_BlackAndWhite = L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {maxZoom: 10,});

//Map Initialisation
var map = L.map('map', {
    center: [0.167, 37.782],
    zoom: 10,
    layers: [grayscale, restaurants]
    });

//Creating 2 objects: Our Baselayers and Overlays
var baseLayers = {
    "GrayScale": grayscale,
    "Streets": streets,
    "OSM B&W": OpenStreetMap_BlackAndWhite
};

var overlays = {
    "Restaurants": restaurants
};

//Layer Control
L.control.layers(baseLayers, overlays).addTo(map);

//Style the Keys
var baseMaps = {
    "<span style='color: gray'>Grayscale</span>": grayscale,
    "Streets": streets
};

//Loading JSON from and external file
var promise = $.getJSON("https://raw.githubusercontent.com/Mburu-coder/OnlineAssignment_0/master/JSON/restaurants.geojson");
promise.then(function(data) {
    var allrestaurants = L.geoJson(data);

    var restaurants = L.geoJson(data, {
        pointToLayer: function(feature, latlng) {
            return L.marker(latlng, {
                icon: restaurantIcon
            }).on('mouseover', function(){
                this.bindPopup('<b> Restaurant Name: </b>' + feature.properties.name + '<br>' + '<b> Cuisine: </b>' + feature.properties.cuisine).openPopup();
            });
        }
    }).addTo(map);

    map.fitBounds(allrestaurants.getBounds(), {
        padding: [50, 50]
    })
    console.log(data) // take a look at the data in the console
});

//Creating Restaurant Icon
var restaurantIcon = L.AwesomeMarkers.icon({
    prefix: 'fa', //font awesome rather than bootstrap
    markerColor: 'blue', //Possible: red, darkred, orange, green, darkgreen, blue, purple, dark purple
    icon: 'bookmark' //https://fontawesome.com/icons?from=io
});
