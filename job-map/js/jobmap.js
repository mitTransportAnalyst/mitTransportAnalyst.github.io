var cities = {
  los: {
    only: false,
    center: [34.036952, -118.262],
	cartoUrl: 'https://ansoncfit.carto.com/api/v2/viz/665bf7fc-a845-11e6-aea7-0ecd1babdde5/viz.json',
	attribution: 'Buildings: <a href="http://egis3.lacounty.gov/dataportal/2011/04/28/countywide-building-outlines/">LA County</a> | Jobs: <a href="http://lehd.ces.census.gov/data/lodes/">LEHD</a> | &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
  },
  bos: {
    only: false,
    center: [42.356324038655934, -71.06729507446289],
	cartoUrl: 'https://ansoncfit.carto.com/api/v2/viz/73156de8-9b48-11e6-a28c-0e05a8b3e3d7/viz.json',
	attribution: 'Buildings: <a href="http://www.mass.gov/anf/research-and-tech/it-serv-and-support/application-serv/office-of-geographic-information-massgis/datalayers/structures.html">MassGIS</a> | Jobs: <a href="http://lehd.ces.census.gov/data/lodes/">LEHD</a> | &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
  },
  lon: {
    only: false,
    center: [51.51272212041476, -0.11449813842773436],
	mbUrl: 'https://api.mapbox.com/styles/v1/ansoncfit/civcwrsd800732iphezaknnr1/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYW5zb25jZml0IiwiYSI6IkVtYkNiRWMifQ.LnNJImFvUIYbeAT5SE3glA',
	cartoUrl: 'https://ansoncfit.carto.com/api/v2/viz/ebceb722-a533-11e6-8750-0e3ff518bd15/viz.json',
	attribution: 'Buildings: <a href="https://mapzen.com/data/metro-extracts/metro/london_england/">Mapzen</a> | Jobs: <a href="http://www.ons.gov.uk/census/2011census/2011censusdata/2011censusdatacatalogue">ONS 2011 Census</a> | &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>, Mapbox '
  }
}

mapArray = [];

var initialZoom = 13;
  
zoomAll = function (cityId, zoom) {
  if (!cities[cityId].only){  
  mapArray.forEach(function(map){
    map.setZoom(zoom);
  })
  }
}

  
$().ready(function(){
  $('[data-toggle="popover"]').popover();   
  
  $(".mbmap").each(function(){
    var cityId = $(this).attr("id");
	
	  var map = new L.Map(cityId, {
		center: cities[cityId].center,
		zoom: initialZoom,
		maxZoom: 17,
		minZoom: 11,
		scrollWheelZoom: 'center'
	  });
	  
	  map.zoomControl.setPosition('topright');
	  
	  map.attributionControl
	  .addAttribution(cities[cityId].attribution)
	  .setPrefix(false);
	  
	  L.tileLayer(cities[cityId].mbUrl).addTo(map);
	  
	  map.on('zoomend', function (e) {
		zoomAll(cityId, map.getZoom());
	  })
	  
	  mapArray.push(map)
	  
  })

  $(".lmap").each(function(){
	  
	  var cityId = $(this).attr("id");
	
	  var map = new L.Map(cityId, {
		center: cities[cityId].center,
		zoom: initialZoom,
		maxZoom: 17,
		minZoom: 11,
		scrollWheelZoom: 'center'
	  });
	  
	  map.zoomControl.setPosition('topright');
	  
	  L.tileLayer('https://api.mapbox.com/styles/v1/ansoncfit/civ8yppzc000w2iph4dxl9cfr/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYW5zb25jZml0IiwiYSI6IkVtYkNiRWMifQ.LnNJImFvUIYbeAT5SE3glA').addTo(map);
	  
	  cartodb.createLayer(map, cities[cityId].cartoUrl,{legends: false})
      .addTo(map);
	
	  L.tileLayer('https://api.mapbox.com/styles/v1/ansoncfit/civcxjlkt003d2ipbav09o9v0/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYW5zb25jZml0IiwiYSI6IkVtYkNiRWMifQ.LnNJImFvUIYbeAT5SE3glA'
	  )
	  .setZIndex(650)
	  .addTo(map);
	  
	  map.attributionControl
	  .addAttribution(cities[cityId].attribution)
	  .setPrefix(false);
	  
	  map.on('zoomend', function (e) {
		zoomAll(cityId, map.getZoom());
	  })
	  
	  mapArray.push(map)
  });
});

resetCity = function () { //clicking on one of the city titles
  for (city in cities) {
    cities[city].only = false;
	$('#'+city+'-mapcol').removeClass('col-md-1');
	$('#'+city+'-mapcol').removeClass('col-md-10');
	$('#'+city+'-mapcol').addClass('col-md-4');
	$('#'+city+'-mapcol').find('.stat').removeClass('hidden');
  }
}

resizeColumns = function (showAll) {
  for (city in cities) {
    if (showAll){
	  $('#'+city).removeClass('hidden');
	  $('#'+city+'Title').removeClass('active')
	} else {
	  if (cities[city].only) {
	    $('#'+city).removeClass('hidden');
		$('#'+city+'Title').addClass('active');
		$('#'+city+'-mapcol').removeClass('col-md-4');
		$('#'+city+'-mapcol').addClass('col-md-10');
	  } else {
	    $('#'+city).addClass('hidden');
		$('#'+city+'Title').removeClass('active');
		$('#'+city+'-mapcol').removeClass('col-md-4');
		$('#'+city+'-mapcol').find('.stat').addClass('hidden');
		$('#'+city+'-mapcol').addClass('col-md-1');
	  }
	}
  }
  mapArray.forEach(function(map){
     setTimeout(function(){map.invalidateSize();}, 200);
  })
}

$(function(cityClick){ //clicking on one of the city titles
  $('.city').click(function(event) {
	if (cities[$(this).attr('id').slice(0,3)].only){
	  resetCity();
	  resizeColumns(true);
	} else {
	  resetCity();
	  cities[$(this).attr('id').slice(0,3)].only = true;
	  resizeColumns(false);
	}
  })
 }
)


