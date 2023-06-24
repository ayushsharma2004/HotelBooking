var lat, long;

function initMap() {
  var loclat, loclng;
  const myLatlng = { lat: -25.363, lng: 131.044 };
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: myLatlng,
  });
  //console.log(location.lat);
  // Create the initial InfoWindow.
  let infoWindow = new google.maps.InfoWindow({
    content: 'Click the map to get Lat/Lng!',
    position: myLatlng,
  });

  infoWindow.open(map);
  // Configure the click listener.
  map.addListener('click', (mapsMouseEvent) => {
    // Close the current InfoWindow.
    infoWindow.close();
    // Create a new InfoWindow.

    infoWindow = new google.maps.InfoWindow({
      position: mapsMouseEvent.latLng,
      map,
    });
    loclat = mapsMouseEvent.latLng.toJSON()['lat'];
    loclng = mapsMouseEvent.latLng.toJSON()['lng'];
    infoWindow.open(map);
    console.log(loclat);
    console.log(loclng);
  });
}
window.initMap = initMap;

//display and hides
function map_display() {
  // let mapbtn = document.getElementById('mapbtn');
  var maps = document.getElementById('map');
  var back = document.getElementById('back');
  var navbar = document.getElementById('navbar');
  let slider = document.getElementById('slider');
  var map_pos = maps.getBoundingClientRect();
  console.log(navbar);
  maps.style.display = 'block';
  back.style.opacity = '0.4';
  navbar.style.opacity = '0.4';
  slider.style.opacity = '0.4';
  document.addEventListener(
    'click',
    (e) => {
      console.log(e.key);
      var x = e.pageX;
      var y = e.pageY;
      console.log(x, y);
      console.log(map_pos.left, map_pos.top, map_pos.right, map_pos.bottom);
      if (x < 410 || y < 210.9 || x > 940 || y > 535.9) {
        console.log('hi');
        maps.style.display = 'none';
        back.style.opacity = '1';
        navbar.style.opacity = '1';
        slider.style.opacity = '1';
        document.removeEventListener('click', e);
        return;
      }
    },
    3000
  );
  return;
}

function srchloc() {
  var locate = document.getElementById('srch-inp').value;
  console.log(locate);
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'e531a78447msh21abaa39b72bd6fp19f90djsn1bf061719901',
      'X-RapidAPI-Host': 'booking-com.p.rapidapi.com',
    },
  };
  var surl =
    'https://booking-com.p.rapidapi.com/v1/hotels/locations?name="' +
    locate +
    '&locale=en-gb';
  var locations = fetch(surl, options)
    .then((response) => response.json())
    .then((response) => {
      var location = response[0];
      console.log(location);
      var loclat = location['latitude'];
      var loclng = location['longitude'];
      console.log('Search');
      console.log(loclat, loclng);
      cards(loclat, loclng);
    })
    .catch((err) => console.error(err));
  // for (location in locations) {
  //   console.log(location);
  // }
  //console.log(locations[0]);
}
// console.log(location);
// console.log(typeof location);
async function cards(latd, lngd) {
  var content = document.getElementById('content');
  lat = latd;
  long = lngd;
  let checkin = document.getElementById('checkin').value;
  let checkout = document.getElementById('checkout').value;
  console.log(checkin);
  console.log(checkout);
  let text = '    <div class="box-container">\n';
  console.log('Cards');
  console.log(lat, long);
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'e531a78447msh21abaa39b72bd6fp19f90djsn1bf061719901',
      'X-RapidAPI-Host': 'booking-com.p.rapidapi.com',
    },
  };

  url =
    'https://booking-com.p.rapidapi.com/v1/hotels/search-by-coordinates?units=metric&room_number=1&longitude=' +
    long +
    '&latitude=' +
    lat +
    '&filter_by_currency=AED&order_by=popularity&locale=en-gb&checkout_date=' +
    checkout +
    '&adults_number=2&checkin_date=' +
    checkin;
  console.log(url);

  response = await fetch(url, options);
  hotel_list = await response.json();
  var hotels = hotel_list['result'];
  console.log(hotels);
  for (let x in hotels) {
    var imgurl = hotels[x]['main_photo_url'];
    var currency = hotels[x]['currency_code'];
    var price = Math.round(hotels[x]['min_total_price']);
    var price_format = Math.round(price).toLocaleString('en-US', {
      style: 'currency',
      currency: currency,
    });
    console.log(imgurl);
    text += '        <div class="box">\n';
    text += '            <img src="' + imgurl + '" alt="">\n';
    text += '            <div class="content">\n';
    text +=
      '                <h3><i class="fas fa-map-marker-alt"></i> ' +
      hotels[x]['city'] +
      ' </h3>\n';
    text += '                <p>' + hotels[x]['hotel_name'] + '</p>\n';
    text += '                <div class="stars">\n';
    text += '                    <i class="fas fa-star"></i>\n';
    text += '                    <i class="fas fa-star"></i>\n';
    text += '                    <i class="fas fa-star"></i>\n';
    text += '                    <i class="fas fa-star"></i>\n';
    text += '                    <i class="far fa-star"></i>\n';
    text += '                </div>\n';
    text += '                <div class="price"> ' + price_format + ' </div>\n';
    text += '                <a href="#" class="btn">book now</a>\n';
    text += '            </div>\n';
    text += '        </div>\n';
    console.log(hotels[x]['hotel_name']);
  }
  text += '    </div>\n';
  console.log(content);

  console.log(text);
  document.body.innerHTML += text;
}
