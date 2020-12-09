var mymap = L.map('map').setView([47.50232, -122.35142], 10);

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
	    fillColor: "#ff7800",
	    color: "#000",
	    weight: 1,
	    opacity: 1,
	    fillOpacity: 0.8
	};

	$.getJSON("data/hospitals.geojson",function(data){
		//onEachFeature: onEachFeature,
      L.geoJson(data, {
          pointToLayer: function(feature, latlng){
              var marker = L.circleMarker(latlng,marker_style);
              // marker.bindPopup("Case #: " + feature.properties.CaseNo + "<br>LocCode: " + feature.properties.LocCode + "<br>Name of Crime: "+feature.properties.Public_Nam+"<br>Date: "+feature.properties.OccurredOn);
              //marker.bindPopup("hello!");
              return marker;
          }

      }).addTo(mymap);
  });

	//
	// function onEachFeature(feature, layer) {
	// 		layer.on({
	// 			mouseover: highlightFeature
	// 		});
	//
	// 		function highlightFeature(e) {
	// 				var layer = e.target;
	//
	// 				layer.setStyle({
	// 					radius: 9,
	//  		 	    fillColor: "#666",
	//  		 	    color: "#000",
	//  		 	    weight: 1,
	//  		 	    opacity: 1,
	//  		 	    fillOpacity: 0.8
	// 				});
	//
	// 				if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
	// 					layer.bringToFront();
	// 				}
	//
	// 				info.update(layer.feature.properties);
	// 			}





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
