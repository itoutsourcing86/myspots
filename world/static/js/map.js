    function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
    }


var map, newMarker, markers, mapquest, firstLoad;

      firstLoad = true;

      markers = new L.MarkerClusterGroup({spiderfyOnMaxZoom: true, showCoverageOnHover: false, zoomToBoundsOnClick: true});
      newMarker = new L.LayerGroup();


      mapquest = new L.TileLayer("http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png", {
        maxZoom: 18,
        subdomains: ["otile1", "otile2", "otile3", "otile4"],
        attribution: 'Basemap tiles courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">. Map data (c) <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> contributors, CC-BY-SA.'
      });


      map = new L.Map('map', {
        center: new L.LatLng(55.40573, 37.79297),
        zoom: 3,
        layers: [mapquest, markers, newMarker],
        attributionControl: false,
        zoomControl: false,
        worldCopyJump: true,
      });


      L.control.scale().addTo(map);

      new L.Control.Zoom({
        zoomInTitle: 'Увеличить',
        zoomOutTitle: 'Уменьшить',
      }).addTo(map);

      L.control.locate({position: 'topright', icon: 'fa fa-location-arrow',
        showPopup: false, strings: {title: 'Мое местоположение'},
        locateOptions: {maxZoom: 15}}).addTo(map);


      $(document).ready(function() {
        $.ajaxSetup({headers: { "X-CSRFToken": getCookie("csrftoken") }, cache: false});
        $('#map').css('height', ($(window).height() - 40));
        getMarkers();
      });

      $(window).resize(function () {
        $('#map').css('height', ($(window).height() - 40));
      }).resize();


      function getMarkers(){
        $.getJSON("add_marker", function(data){
            for(var i=0; i<data.length; i++){
                var location = new L.LatLng(data[i].elat, data[i].elon);
                var title = data[i].title;
                var message = '<p>'+data[i].message+'</p>';
                var marker = new L.marker(location, {
                    title: title
                }).bindPopup(message, {minWidth: '300'});
                markers.addLayer(marker);
            }
        });
      }


      function initMarker() {
        map.addEventListener('click', onMapClick);
        $('#map').css('cursor', 'crosshair');
        return false;
      }


      function cancelMarker() {
        newMarker.clearLayers();
        $('#map').css('cursor', '');
        map.removeEventListener('click', onMapClick);
      }


      function insertMarker(){
        var email = $('#email').val();
        var title = $('#name').val();
        var message = $('#message').val();
        var lat = $('#lat').val();
        var lng = $('#lng').val();
        var data = {'email': email, 'title': title, 'message': message, 'lat': lat, 'lng': lng};
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: 'add_marker/',
            data: data,
            success: function(data){
                cancelMarker();
                markers.clearLayers();
                getMarkers();
            }
        });
      }


      function onMapClick(e) {
        var marker = new L.Marker(e.latlng);
        newMarker.clearLayers();
        newMarker.addLayer(marker);
        var form = "<form action='' id='insertMarker' method='POST' formenctype='multipart/form-data'>"+
            '<div class="form-group">'+
            '<label><strong>Email:</strong> <i>*не будет никому показан</i></label>'+
            '<input type="email" class="form-control" required="required" id="email" name="email" placeholder="Email..."/>'+
            '</div>'+
            '<div class="form-group">'+
            '<label><strong>Заголовoк:</strong> <i>*это название маркера</i></label>'+
            '<input type="text" class="form-control" required="required" id="name" name="name" placeholder="Название маркера..."/>'+
            '</div>'+
            '<div class="form-group">'+
            '<span class="btn btn-success btn-sm" style="position: relative; overflow: hidden; display: inline-block">'+
            '<i class="glyphicon glyphicon-plus"></i>'+
            '<span>Добавить фото</span>'+
            '<input name="image[]" multiple="" type="file" class="file"></input>'+
            '</span>'+
            '</div>'+
            '<div class="form-group">'+
            '<label><strong>Сообщение:</strong></label>'+
            '<textarea class="form-control" required="required" id="message" name="message" placeholder="Текст..."></textarea>'+
            '</div>'+
            '<div class="form-group">'+
            '<button type="reset" class="btn btn-default" onClick="cancelMarker()">Отмена</button>'+
            '<input type="submit" class="btn btn-primary"'+
            'style="margin-left: 5px;" value="Установить маркер" data-loading-text="Сохраняем...">'+
            '</div>'+
            '<input style="display: none;" type="text" id="lat" name="lat" value="'+e.latlng.lat.toFixed(6)+'" />'+
            '<input style="display: none;" type="text" id="lng" name="lng" value="'+e.latlng.lng.toFixed(6)+'" />'+
            "</form>";
        marker.bindPopup(form).openPopup();

        $('#insertMarker').submit(function(event){
          event.preventDefault();
          insertMarker();
        });
      }


      $('#contact_form').submit(function(event){
        event.preventDefault();
        var email = $('#id_email').val();
        var theme = $('#id_theme').val();
        var message = $('#id_message').val();
        var data = {email: email, theme: theme, message: message};
        $.ajax({
            url: 'contact/',
            type: 'POST',
            data: data,
            dataType: 'json',
            success: function(data){
                $('#contact').modal('hide');
            }
        });
      });