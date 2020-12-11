var mymap = L.map('map',{scrollWheelZoom:false}).setView([47.50232, -122.35142], 10);

	L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		id: 'mapbox/streets-v11',
		tileSize: 512,
		zoomOffset: -1
	}).addTo(mymap);


	var marker_style = {
	    radius: 8,
	    fillColor: "#8B2323",
	    color: "#000",
	    weight: 1,
	    opacity: 1,
	    fillOpacity: 0.8
	};

	$.getJSON("data/hospitals.geojson",function(data){

      L.geoJson(data, {
					onEachFeature: onEachFeature,
          pointToLayer: function(feature, latlng){
              var marker = L.circleMarker(latlng,marker_style);
              // marker.bindPopup("Case #: " + feature.properties.CaseNo + "<br>LocCode: " + feature.properties.LocCode + "<br>Name of Crime: "+feature.properties.Public_Nam+"<br>Date: "+feature.properties.OccurredOn);
              //marker.bindPopup("hello!");
              return marker;
          }

      }).addTo(mymap);
  });



function onEachFeature(feature, layer) {
		layer.on({
			// mouseover: hospitalAccessibleArea,
			mouseout: resetmarker,
			click:hospitalAccessibleArea
		});
}

function hospitalAccessibleArea(e){
	var layer = e.target;
	layer.setStyle({
				radius: 400,
		 	    fillColor: "#F0FFFF",
		 	    color: "#8B2323",
		 	    weight: 5,
		 	    opacity: 1,
		 	    fillOpacity: 0.6
			});

			var latlong = [layer.getLatLng()];
		  var markerBounds = L.latLngBounds(latlong);
			mymap.fitBounds(markerBounds);


			var latLon = layer.getLatLng();
			mymap.setView([latLon["lat"],latLon["lng"]],17);



			// var myZoom = {
			//   start:  mymap.getZoom(),
			//   end: mymap.getZoom()
			// };
			//
			// mymap.on('zoomstart', function(e) {
			//    myZoom.start = mymap.getZoom();
			// });
			//
			// mymap.on('zoomend', function(e) {
			//     myZoom.end =mymap.getZoom();
			//     var diff = myZoom.start - myZoom.end;
			//     if (diff > 0) {
			//         circle.setRadius(circle.getRadius() * 2);
			//     } else if (diff < 0) {
			//         circle.setRadius(circle.getRadius() / 2);
			//     }
			// });

}



function resetmarker(e){
	var layer = e.target;
	layer.setStyle({
			radius: 8,
			fillColor: "#8B2323",
			color: "#000",
			weight: 1,
			opacity: 1,
			fillOpacity: 0.8
	});

			mymap.setView([47.50232, -122.35142],10);
}

// function highlightFeature(e) {
// 		var layer = e.target;
//
// 		layer.setStyle({
// 			radius: 9,
// 	 	    fillColor: "#666",
// 	 	    color: "#000",
// 	 	    weight: 1,
// 	 	    opacity: 1,
// 	 	    fillOpacity: 0.8
// 		});
//
// 		if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
// 			layer.bringToFront();
// 		}
//
// 		info.update(layer.feature.properties);
// 	}





	//
	//
	// 	var geojson;
	//
	// 	function resetHighlight(e) {
	// 		geojson.resetStyle(e.target);
	// 		//info.update();
	// 	}
	//
	// 	function zoomToFeature(e) {
	// 		map.fitBounds(e.target.getBounds());
	// 	}
	//
	// 	function onEachFeature(feature, layer) {
	// 		layer.on({
	// 			mouseover: highlightFeature,
	// 			mouseout: resetHighlight,
	// 			click: zoomToFeature
	// 		});
	// 	}
