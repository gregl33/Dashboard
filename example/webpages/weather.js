







function loadWeather(place,lat,lon) {
  window.status_.style.display = 'none';

  window.spanwea.style.display = 'inline-block';

var url;
if(place==0){
  url = '/calendar/weather?type=geo&lat='+lat+"&lon="+lon;
}else{
  url = '/calendar/weather?type=town&place='+place;//+"&lon="+lon;

}


sendR(url,function(res){
  Weather = res;
  showWeather();
  showForecastWeather();

});

}











function checkSubmit(e) {
   if(e && e.keyCode == 13) {
      loadWeather(e.target.value);
      //Place = e.target.value;
      e.target.value='';
   }
}
window.addEventListener('load' ,geoFindMe);


function geoFindMe() {

  if(window.location.hostname != "localhost"){
    loadWeather("London");
    return;
  }
//window.weatherDesc.textContent= 'Grabbing location...';
  if (!navigator.geolocation){
    console.log("Geolocation is not supported by your browser");
    return;
  }

  function success(position) {
    var latitude  = (position.coords.latitude).toFixed(1),
     longitude = (position.coords.longitude).toFixed(1);

    loadWeather(0,latitude,longitude);
    //window.weatherDesc.textContent= 'Loading Weather...';

  }

    function error() {
      console.log("Unable to retrieve your location");
      loadWeather("Southampton");

    }

    navigator.geolocation.getCurrentPosition( success, error);

}

function degToCompass(num){
  var return_='';
if(num!=undefined){
  var val = Math.floor(((num/22.5)+0.5));
  var arr = ["N","NNE","NE","ENE","E","ESE", "SE", "SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
  return_= arr[(val % 16)];
}
return return_;
}

var Weather = [];



function showWeather(){

  window.weaH1.textContent = Weather[0].name + ", "+Weather[0].sys.country;//"Weather "+;

  window.sunrise.textContent=new Date(Weather[0].sys.sunrise * 1000).toTimeString().substring(0,5);
  window.sunset.textContent=new Date(Weather[0].sys.sunset * 1000).toTimeString().substring(0,5);


  window.weatherDesc.textContent = titleCase(Weather[0].weather[0].description);
  window.iconWeather.src = 'http://openweathermap.org/img/w/'+Weather[0].weather[0].icon+'.png';

  window.currentTemp.textContent = (Weather[0].main.temp).toFixed();

  window.pressure.textContent = Math.floor(Weather[0].main.pressure)+" hPa";

  var direction = degToCompass(Weather[0].wind.deg);
  window.wind.textContent = (Weather[0].wind.speed).toFixed()+" m/s " + direction;

}


function showForecastWeather(){


  while(window._5day.firstChild){
    window._5day.removeChild(window._5day.firstChild);
  }
for(var i = 1;i<Weather[1].list.length;i++){
  var li =  document.createElement("li");
var span_WeaDate = document.createElement("span");
var span_iconFore = document.createElement("img");
var span_weaDesc = document.createElement("span");
var span_dayTemp = document.createElement("span");
var span_nighttemp = document.createElement("span");
var span_foreWind = document.createElement("span");
var span_forePressure = document.createElement("span");
span_WeaDate.id ="WeaDate";
span_iconFore.id = "iconFore";
span_weaDesc.id ="weaDesc";
span_dayTemp.id ="dayTemp";
span_nighttemp.id ="nightTemp";
span_foreWind.id = "foreWind";
span_forePressure.id = "forePressure";

var direction = degToCompass(Weather[1].list[i].deg);

span_WeaDate.textContent=new Date(Weather[1].list[i].dt * 1000).toDateString().substring(0,4);


span_iconFore.src='http://openweathermap.org/img/w/'+Weather[1].list[i].weather[0].icon+'.png';
span_weaDesc.textContent=titleCase(Weather[1].list[i].weather[0].description);
span_dayTemp.textContent=(Weather[1].list[i].temp.day).toFixed()+"°C";
span_nighttemp.textContent=(Weather[1].list[i].temp.night).toFixed()+"°C";
span_foreWind.textContent= (Weather[1].list[i].speed).toFixed() +" m/s " + direction;
span_forePressure.textContent=Math.floor(Weather[1].list[i].pressure)+" hPa";;

li.appendChild(span_WeaDate);
li.appendChild(span_weaDesc);
li.appendChild(span_iconFore);
li.appendChild(span_dayTemp);
li.appendChild(span_nighttemp);
li.appendChild(span_foreWind);
li.appendChild(span_forePressure);
window._5day.appendChild(li);

}
window._5day.lastElementChild.style.border = "none";
}


function titleCase(str) {
  return str.split(' ').map(function(word) {
    return (word.charAt(0).toUpperCase() + word.slice(1));
  }).join(' ');
}
