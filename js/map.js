var mymap = L.map('map',{scrollWheelZoom:false}).setView([47.50232, -122.35142], 10);

	L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		id: 'mapbox/streets-v11',
		tileSize: 512,
		zoomOffset: -1
	}).addTo(mymap);

//number of people variable
	var num_people=0;
	//controls to show info
	var info = L.control();
	info.onAdd = function(mymap){
		this._div = L.DomUtil.create('div', 'info');
		this.update();
		return this._div;
	};

// information display
info.update = function (props,num_people) {
	this._div.innerHTML = "<h5>Healthcare Info</h5>"+ (props ?
	"Name: <b>"+props.NAME +"</b><br/>Address: <b>"+props.ADDRESS+"</b><br>"+
	"Num of People in 2 mi Buffer: <b>"+num_people+"</b>"
	:"Click on Hospital Markers");
};

//adding to
info.addTo(mymap);



//randomize number between 30 and 100 (signifying number of people)
function randomValue(){
	return Math.floor(Math.random() * 31) + 70;
}

//color range
function getColor(d) {
		return d > 70 ? '#8B2323': '#FFE4C4';
}

//circle marker
var marker_style = {
    radius: 8,
    fillColor: "#DC143C",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

//displaying geojson data
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
	num_people = randomValue();
	layer.setStyle({
				radius: 350,
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
			fillColor: "#DC143C",
			color: "#000",
			weight: 1,
			opacity: 1,
			fillOpacity: 0.8
	});

	mymap.setView([47.50232, -122.35142],10);
	info.update();
}

//creating legend
var legend = L.control({position: 'bottomright'});

	legend.onAdd = function (mymap) {

		var div = L.DomUtil.create('div', 'info legend'),
			grades = [0, 70],
			labels = ["<i style='background:#DC143C'></i> Healthcare facility"],
			from, to;

		for (var i = 0; i < grades.length; i++) {
			from = grades[i];
			to = grades[i + 1];

			labels.push(
				'<i style="background:' + getColor(from + 1) + '"></i> ' +
				from + (to ? ' &ndash; ' + to+' (People per 2 mi radius)' : '+ (People per 2 mi radius)'));
		}
		labels.push();

		div.innerHTML = labels.join('<br>');
		return div;
	};

//adds legend to map
	legend.addTo(mymap);

//======================================================end of healthcare access map =================================


var popmap = L.map('popmap',{scrollWheelZoom:false}).setView([47.45591, -121.79971], 10);

	L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		id: 'mapbox/light-v9',
		tileSize: 512,
		zoomOffset: -1
	}).addTo(popmap);


	var popinfo = L.control();

	popinfo.onAdd = function(popmap){
		this._div = L.DomUtil.create('div', 'popinfo');
		this.update();
		return this._div;
	};

// information display
popinfo.update = function (props) {
	this._div.innerHTML = "<h6>Occupancy Status (2012-2016)</h6>"+ (props ?
	"Housing Unit: <b>"+props.TRACT_LBL +"</b><br/>Estimate Occupied Units: <b>"+props.E25002003+"</b><br>"+
	"Estimate Vacant Units: <b>"+props.E25002004+"</b>"
	:"Click on Housing Units to View chart");
};

//adding to
popinfo.addTo(popmap);

	var popjeoson;

	function popStyle(feature) {
		return {
			weight: 1,
			opacity: 1,
			color: '#ABABAB',
			dashArray: '',
			fillOpacity: 0.6,
			fillColor: getpopcolor(feature.properties.E25002003)
		};
	}


	// get color depending on occupancy estimate
		function getpopcolor(d) {
			return d > 3500 ? '#668B8B' :
					d > 3000  ? '#96CDCD' :
					d > 2500  ? '#AEEEEE' :
					d> 2000 ? '#BBFFFF' :
					d> 1800 ? '#800026' :
					d > 1600  ? '#BD0026' :
					d > 1400  ? '#E31A1C' :
					d > 1200  ? '#FC4E2A' :
					d > 1000   ? '#FD8D3C' :
					d > 800   ? '#FEB24C' :
					d > 500   ? '#FED976' :
								'#FFEDA0';
		}

		//displaying geojson data
			$.getJSON("data/occupancy_status.geojson",function(data){
		     popjeoson = L.geoJson(data, {
						style:popStyle,
					  onEachFeature: onEachHousingFeature

		      }).addTo(popmap);
		  });



			function onEachHousingFeature(feature, layer){
				layer.on({
					mouseover: hoverHousingUnitFeature,
					mouseout: resetHousingUnit,
					click:clickHousingUnitFeature
				});
			}


			function clickHousingUnitFeature(e){
				//do nothing
				popmap.fitBounds(e.target.getBounds());
				$(".chart-container").show();
			}


			function hoverHousingUnitFeature(e){
					var layer = e.target;

					layer.setStyle({
						weight: 2,
						color: '#9400D3',
						dashArray: '',
						fillOpacity: 0.7
					});

					if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
						layer.bringToFront();
					}

					popinfo.update(layer.feature.properties);
					estimate_chartinfo.update(layer.feature.properties);
					$(".chart-container").show();
			}


			function resetHousingUnit(e){
				popjeoson.resetStyle(e.target);
				popmap.setView([47.45591, -121.79971], 10);
				popinfo.update();
				$(".chart-container").hide();
			}


			var poplegend = L.control({position: 'bottomright'});

				poplegend.onAdd = function (map) {

					var popdiv = L.DomUtil.create('div', 'popinfo poplegend'),
						popgrades = [0, 500, 800, 1000, 1200, 1400, 1600, 1800,2000,2500,3000,3500],
						poplabels = ['<b>Estimated Occupied Units</b>'],
						popfrom, popto;

					for (var i = 0; i < popgrades.length; i++) {
						popfrom = popgrades[i];
						popto = popgrades[i + 1];

						poplabels.push(
							'<i style="background:' + getpopcolor(popfrom + 1) + '"></i> ' +
							popfrom + (popto ? '&ndash;' + popto : '+'));
					}

					popdiv.innerHTML = poplabels.join('<br>');
					return popdiv;
				};

				poplegend.addTo(popmap);


				$(".chart-container").hide();

				var estimate_chartinfo = L.control({position: 'bottomleft'});

				estimate_chartinfo.onAdd = function(popmap){
					this._div = L.DomUtil.create('div', 'popinfo');
					this.update();
					return this._div;
				};

			// information display
			estimate_chartinfo.update = function (props) {
				// this._div.innerHTML = "<h6>Occupancy Status (2012-2016)</h6>"+ (props ?
				// "Housing Unit: <b>"+props.TRACT_LBL +"</b><br/>Estimate Occupied Units: <b>"+props.E25002003+"</b><br>"+
				// "Estimate Vacant Units: <b>"+props.E25002004+"</b>"
				// :"Click on Housing Units");
				//this._div.innerHTML = "<canvas id='occupancy_chart'></canvas>";


				createChart(props.E25002003,props.E25002004);

			};


			function createChart(estimated_occupied,estimate_vacant){
				var ctx = document.getElementById('occupancy_chart');
				var chart = new Chart(ctx, {
				// The type of chart we want to create
				type: 'bar',

					// The data for our dataset
					data: {
							labels: ['Est. Occupied', 'Est. Vacancy'],
							datasets: [{
									label: 'Occupied and Vacant Units',
									backgroundColor: ['rgb(255, 99, 132,0.7)','rgba(54, 162, 235, 0.7)'],
									borderColor: ['rgb(255, 99, 132,0.7)','rgba(54, 162, 235, 0.7)'],
									data: [estimated_occupied, estimate_vacant]
							}]
					},

					// Configuration options go here
					options: {}
			});
			}

			//adding to
			estimate_chartinfo.addTo(popmap);
