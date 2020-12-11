var mymap = L.map('map',{scrollWheelZoom:false}).setView([47.50232, -122.35142], 10);

	L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		id: 'mapbox/streets-v11',
		tileSize: 512,
		zoomOffset: -1
	}).addTo(mymap);

//
	var num_people=0;
	//controls to show info
	var info = L.control();
	info.onAdd = function(mymap){
		this._div = L.DomUtil.create('div', 'info');
		this.update();
		return this._div;
	};

//
info.update = function (props,num_people) {
	this._div.innerHTML = "<h4>Hospital Info</h4>"+ (props ?
	"Name: <b>"+props.NAME +"</b><br/>Address: <b>"+props.ADDRESS+"</b><br>"+
	"Number of People Accessing: <b>"+num_people+"</b>"
	:"Click on Hospital");
};

//adding to
info.addTo(mymap);



//ramdomize number between 30 and 100
function randomValue(){
	return Math.floor(Math.random() * 31) + 70;
}

//color range
function getColor(d) {
		return d > 70 ? '#8B2323':'#F0FFFF';
}


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

//create marker with 400 as a distance of 2 mile radius
function hospitalAccessibleArea(e){
	var layer = e.target;
	var num_people = randomValue();
	layer.setStyle({
				radius: 400,
		 	    fillColor: getColor(num_people),
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

			info.update(layer.feature.properties, num_people);

}


//reset and zoom marker to default
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
