$(document).ready(function(){
	
	var szerokosc = window.innerWidth-20;
	var wysokosc = window.innerHeight-20;
	var wmslist = [];
	
	$("#map").css("width", szerokosc);
	$("#map").css("height", wysokosc - 50);
	$(window).resize(function(){
		szerokosc = window.innerWidth-20;
		wysokosc = window.innerHeight-20;
		$("#map").css("width", szerokosc);
		$("#map").css("height", wysokosc - 50);
	});
	var map = L.map('map').setView([52.00,
          19.50], 7);

	// add an OpenStreetMap tile layer
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
	    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);
	
	
	
	$(".kategorie li ol").hide(); 
    $('.kategorie a').click(
    	function(){
    		var podkategorie = $(this).next('ol');
        	podkategorie.toggle(300); 
    	}); 
    $('#zagrozenie ').click(function(){
    	$('#wms ol').hide(300);
    	$('#przeglad').hide(300);
    });
    $('#wms').click(function(){
    	$('#zagrozenie ol').hide(300);
    	$('#przeglad').hide(300);
    });
    
    var wszystkieZagr = [];
    var n =0;
    
    $('#przeglad').hide();
    
    $('#przegladZagrozen').click(function(){
    	$('#wms ol').hide(300);
    	$('#zagrozenie ol').hide(300);
    	$('#dodPunkt').removeClass('klikniety');
   			$('#dodOkrag').removeClass('klikniety');
   			$('#dodPoligon').removeClass('klikniety');
   			$('#wskazPozycje').removeClass('klikniety');
    		punkt = false;
    		okrag = false;
    		poligon = false;
    		pozycja = false;

    	if(twojaPozycja!=null){
    		$('#przeglad').show(300);
	    	wszystkieZagr = [];
	    	n=0;
	    	var poz = L.latLng(twojaPozycja.lat, twojaPozycja.lng);
	    	var pozGeoJson = $.geo.centroid(tp.toGeoJSON().geometry);
	    	
	    	for (i=0; i<punkty.length; i++){
	    		var pkt = punkty[i]._latlng;
	    		wszystkieZagr.push([[pkt.lat, pkt.lng], poz.distanceTo(pkt)]);
	    		n++;
	    	}
	    	for (i=0; i<okregi.length; i++){
	    		var okrGeoJson = $.geo.centroid(okregi[i].toGeoJSON().geometry);
	    		wszystkieZagr.push([[okrGeoJson.coordinates[1], okrGeoJson.coordinates[0]], $.geo.distance(okrGeoJson, pozGeoJson)]);
	    		n++;
	    	}
	    	for (i=0; i<poligony.length; i++){
	    		var poligonyGeoJson = $.geo.centroid(poligony[i].toGeoJSON().geometry);
	    		wszystkieZagr.push([[poligonyGeoJson.coordinates[1], poligonyGeoJson.coordinates[0]], $.geo.distance(poligonyGeoJson, pozGeoJson)]);
	    		n++;
	    	}
	    	
	    	for (i=0; i<strefyZagrozenia.features.length; i++){
	    		var szGeoJson = $.geo.centroid(strefyZagrozenia.features[i].geometry);
	    		wszystkieZagr.push([[szGeoJson.coordinates[1], szGeoJson.coordinates[0]] , $.geo.distance(pozGeoJson, szGeoJson)]);
	    		n++;
	    	}
	    	var licznik = 0;
	    	for(i=0;i<n;i++){
	    		if(wszystkieZagr[i][1]<100000){
	    			licznik++;
	    		}
	    	}
	    	if (licznik>0){
	    		alert("Uwaga! Twoja okolica jest zagrożona przez Zombie!");
	    	}
	    	
	    	if(wszystkieZagr[0][1]<100000){
    		$('#odl').addClass('bliskieZagr');
    	}else{
    		$('#odl').removeClass('bliskieZagr');
    	}
	    	map.setView(wszystkieZagr[0][0], 10);
	    	document.getElementById('odl').innerHTML='Odległość: ' + Math.round(wszystkieZagr[0][1])+ ' m';
    	}else{
    		alert("Najpierw wskaż swoją pozycję.");
    	}
    	
    });
    
    var iterator = 0;
    $('#nastepny').click(function(){
    	iterator++;
    	if(iterator==n){
    		iterator=0;
    	}
    	if(wszystkieZagr[iterator][1]<100000){
    		$('#odl').addClass('bliskieZagr');
    	}else{
    		$('#odl').removeClass('bliskieZagr');
    	}
    	map.setView(wszystkieZagr[iterator][0], 10);
    	document.getElementById('odl').innerHTML='Odległość: ' + Math.round(wszystkieZagr[iterator][1])+ ' m';
    });
    
    $('#poprzedni').click(function(){
    	iterator--;
    	if(iterator==-1){
    		iterator=n-1;
    	}
    	if(wszystkieZagr[iterator][1]<100000){
    		$('#odl').addClass('bliskieZagr');
    	}else{
    		$('#odl').removeClass('bliskieZagr');
    	}
    	map.setView(wszystkieZagr[iterator][0], 10);
		document.getElementById('odl').innerHTML='Odległość: ' + Math.round(wszystkieZagr[iterator][1])+ ' m';    	
    });
    
    var punkt, okrag, poligon, pozycja = false;
    var punkty = [];
    var okregi = [];
    var poligony = [];
    
    $('#dodPunkt').click(function(){
    	if (punkt){
    		$('#dodPunkt').removeClass('klikniety');
    		punkt = false;
    	}else{
   			$('#dodPunkt').addClass('klikniety');
   			$('#dodOkrag').removeClass('klikniety');
   			$('#dodPoligon').removeClass('klikniety');
   			$('#wskazPozycje').removeClass('klikniety');
    		punkt = true;
    		okrag = false;
    		poligon = false;
    		pozycja = false;
    	}
  });
    $('#dodOkrag').click(function(){
    	if (okrag){
    		$('#dodOkrag').removeClass('klikniety');
    		 okrag = false;
    	}else{
    		$('#dodOkrag').addClass('klikniety');
    		$('#dodPunkt').removeClass('klikniety');
   			$('#dodPoligon').removeClass('klikniety');
   			$('#wskazPozycje').removeClass('klikniety');
    		punkt = false;
    		okrag = true;
    		poligon = false;
    		pozycja = false;
    	}
    });
    
    $('#dodPoligon').click(function(){
    	if (poligon){
    		$('#dodPoligon').removeClass('klikniety');
    		poligon = false;
    	}else{
    		$('#dodPoligon').addClass('klikniety');
    		$('#dodPunkt').removeClass('klikniety');
   			$('#dodOkrag').removeClass('klikniety');
   			$('#wskazPozycje').removeClass('klikniety');
    		punkt = false;
    		okrag = false;
    		poligon = true;
    		pozycja = false;
    		wspolrzedne = [];
    	}
    });
    
    $('#wskazPozycje').click(function(){
    	$('#wms ol').hide(300);
    	$('#zagrozenie ol').hide(300);
    	if (pozycja){
    		$('#wskazPozycje').removeClass('klikniety');
    		pozycja = false;
    	}else{
    		$('#wskazPozycje').addClass('klikniety');
    		$('#dodPunkt').removeClass('klikniety');
   			$('#dodOkrag').removeClass('klikniety');
   			$('#dodPoligon').removeClass('klikniety');
    		punkt = false;
    		okrag = false;
    		poligon = false;
    		pozycja = true;
    	}
    });
    
    var wspolrzedne = [];
    var twojaPozycja;
    var tp, tp1;
 
    map.on('click', function(e) {
    	$('#wms ol').hide(300);
    	$('#zagrozenie ol').hide(300);
    	if(punkt){
    		var pkt = L.marker(e.latlng, {color: 'red'}).addTo(map);
			punkty.push(pkt);
    	}
    	if (okrag){
    		var okr = L.circle(e.latlng, 500, {color: 'red'}).addTo(map);
    		okregi.push(okr);
    	}
    	
    	if (poligon){
    		wspolrzedne.push(e.latlng);
    		L.polyline(wspolrzedne).addTo(map);
    	}
    	
    	if(pozycja){
    		twojaPozycja = e.latlng;
    		tp1 = tp;
    		
    		tp = L.circle(e.latlng, 5, {color: 'green'}).addTo(map);
    		map.removeLayer(tp1);
    		L.popup().setLatLng(e.latlng).setContent("Twoja pozycja: " + e.latlng.lat + ", " + e.latlng.lng).openOn(map);
    	}
    });
    
    map.on('dblclick', function(e) {
    	if (poligon){
    		wspolrzedne.push(e.latlng);
    		var pol  = L.polygon(wspolrzedne, {color: 'red'}).addTo(map);
    		poligony.push(pol);
    		wspolrzedne = [];
    	}
    });
    
    
    $('#zarzadzajWMS').hide();
    var top = window.innerHeight/2 - 100;
    var left = window.innerWidth/2 - 100;
    
    var adresyWMS = ["http://mapy.geoportal.gov.pl/wss/service/pub/guest/G2_dyspozyt_med_WMS/MapServer/WMSServer",
    				 "http://mapy.geoportal.gov.pl/wss/service/pub/guest/G2_ZSIN_EUPOS_WMS/MapServer/WMSServer"];
    var warstwyWMS= ["0", "1"];
    var opisWMS= ["Dyspozytornie medyczne", "Stacje Asg-Eupos"];
    
    $('#zarzadzajWMS').css("top", top);
    $('#zarzadzajWMS').css("left", left);
    
    $('#przyciskZarzadzajWMS').click(function(){
    	$('#zarzadzajWMS').show(300);
    	$('#wms ol').hide(300);
    });
  
    var click0, click1 = false;
    var click2 = true;
    var geoJsonLayer = L.geoJson(strefyZagrozenia).addTo(map);
    wmslist[2] = (geoJsonLayer);
    $('#wms2').addClass('klikniety');
    
    $('#wms0').click(function(){
    	
    	if (click0){
    		map.removeLayer(wmslist[0]);
    		delete wmslist[0];
    		click0 = false;
    		$('#wms0').removeClass('klikniety');
    	}else{
    		var wmsLayer = L.tileLayer.wms(adresyWMS[0],{layers : warstwyWMS[0],format: 'image/png',transparent : 'true',version : '1.3.0'});
			wmslist[0]=(wmsLayer);
			map.addLayer(wmsLayer);
			$('#wms0').addClass('klikniety');
			click0 = true;
    	}
    });
    
    $('#wms1').click(function(){
    	if (click1){
    		map.removeLayer(wmslist[1]);
    		delete wmslist[1];
    		click1 = false;
    		$('#wms1').removeClass('klikniety');
    	}else{
    		var wmsLayer = L.tileLayer.wms(adresyWMS[1],{layers : warstwyWMS[1],format: 'image/png',transparent : 'true',version : '1.3.0'});
			wmslist[1] = (wmsLayer);
			map.addLayer(wmsLayer);
			$('#wms1').addClass('klikniety');
			click1 = true;
    	}
    });
    
    $('#wms2').click(function(){
    	if (click2){
    		map.removeLayer(wmslist[2]);
    		delete wmslist[2];
    		click2 = false;
    		$('#wms2').removeClass('klikniety');
    	}else{
    		var geoJsonLayer2 = L.geoJson(strefyZagrozenia).addTo(map);
    		wmslist[2] = (geoJsonLayer2);
    		click2 = true;
    		$('#wms2').addClass('klikniety');
    	}
    });
    
    $('#zarzadzajOK').click(function(){
    	$('#zarzadzajWMS').hide(300);
    });
});

var strefyZagrozenia = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "Opis": "Warszawa"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              20.75042724609375,
              52.265636077067995
            ],
            [
              20.93170166015625,
              52.36469901960148
            ],
            [
              21.12945556640625,
              52.313516199748086
            ],
            [
              21.226959228515625,
              52.18572083717691
            ],
            [
              21.163787841796875,
              52.07781801208549
            ],
            [
              21.04156494140625,
              52.03475265347471
            ],
            [
              20.9124755859375,
              52.051645977410516
            ],
            [
              20.732574462890625,
              52.17393169256846
            ],
            [
              20.75042724609375,
              52.265636077067995
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "Opis": "Trójmiasto"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              18.557281494140625,
              54.55374799334928
            ],
            [
              18.565521240234375,
              54.49157952414198
            ],
            [
              18.562774658203125,
              54.46285445402037
            ],
            [
              18.6328125,
              54.40854093377361
            ],
            [
              18.6932373046875,
              54.39655031438518
            ],
            [
              18.793487548828125,
              54.34134830540377
            ],
            [
              18.864898681640625,
              54.26041150583606
            ],
            [
              18.73992919921875,
              54.220284882124005
            ],
            [
              18.597106933593746,
              54.20904243375493
            ],
            [
              18.386993408203125,
              54.35975722010785
            ],
            [
              18.39385986328125,
              54.52506661464527
            ],
            [
              18.329315185546875,
              54.60309646081845
            ],
            [
              18.485870361328125,
              54.56569261911192
            ],
            [
              18.557281494140625,
              54.55374799334928
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "Opis": "Kraków"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              19.81658935546875,
              50.13290377086724
            ],
            [
              20.029449462890625,
              50.11617530264245
            ],
            [
              20.125579833984375,
              50.065954814811846
            ],
            [
              20.07476806640625,
              49.99714673955339
            ],
            [
              19.94842529296875,
              49.9680059481165
            ],
            [
              19.831695556640625,
              49.99714673955339
            ],
            [
              19.805603027343746,
              50.0923932109388
            ],
            [
              19.81658935546875,
              50.13290377086724
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "Opis": "Up Wrocław"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          17.063848972320557,
          51.11311414939569
        ]
      }
    }
  ]
};