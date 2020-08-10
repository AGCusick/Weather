let lat;
let long;
let currentLocation = document.querySelector('.location');
let alerts = document.querySelector('.alerts');
let currentTemp = document.querySelector('.current-temperature');
let currentWindSpeed = document.querySelector('.current-wind');
let currentWindDirection = document.querySelector('.current-direction');
let currentDescription = document.querySelector('.current-description');
let currentIcon = document.querySelector('.current-icon img');
let forecastIcon = document.querySelectorAll('.icon')
let clock = document.querySelector('.time');
let dateToday = document.querySelector('.date');
// forecast variables
let forecast = document.querySelectorAll('.forecast');
let one = document.querySelector('.day-one');
let two = document.querySelector('.day-two');
let three = document.querySelector('.day-three');
let four = document.querySelector('.day-four');
let five = document.querySelector('.day-five');
// week days for five day forecast
let fiveDayTwo = document.querySelector('.five-day-two');
let fiveDayThree = document.querySelector('.five-day-three');
let fiveDayFour = document.querySelector('.five-day-four');
let fiveDayFive = document.querySelector('.five-day-five');
let fiveDayIcon = document.querySelector('.five-day-icon');
let iOne = document.querySelector('.icon-one img');
let iTwo = document.querySelector('.icon-two img');
let iThree = document.querySelector('.icon-three img');
let iFour = document.querySelector('.icon-four img');
let iFive = document.querySelector('.icon-five img');
// get location
const typeSearch = document.querySelector('.search');
const searchBtn = document.querySelector('.search-btn');

window.addEventListener('DOMContentLoaded', ()=>{
    getLocalStorage();
});

searchBtn.addEventListener('click', (e) =>{
    getLocationData();
    setLocalStorage();
    window.location.reload(true);
    e.preventDefault();
})
        //Dark Sky
function setLocalStorage(){
    localStorage.setItem('place', JSON.stringify(typeSearch.value));
}

function getLocalStorage(){
    let getPlace = localStorage.getItem('place');
    typeSearch.value = getPlace;
    getLocationData();
}
        async function getLocationData(){
            let forward = `https://api.opencagedata.com/geocode/v1/json?q=${typeSearch.value}&countrycode=us&your key=`;

            let fd = await fetch(forward);
            let data = await fd.json();
            //  console.log(data)


            
            currentLocation.innerHTML =  data.results[0].components.city + ', ' + data.results[0].components.state_code;
            if(currentLocation.innerHTML.indexOf('undefined') !== -1){
                currentLocation.innerHTML = typeSearch.value;
            } 
     
    
            lat = data.results[0].bounds.northeast.lat;
            long = data.results[0].bounds.northeast.lng;
            
              const api = `https://api.darksky.net/forecast/your key/${lat},${long} `;

              let info = await fetch(api);
              let weatherData = await info.json();
               console.log(weatherData) 
               console.log(data)
        
                // current conditions
                let {summary, temperature, windSpeed} = weatherData.currently;
                let windBearing = weatherData.currently.windBearing;
                currentTemp.innerHTML = 'Current Temp: ' +  Math.round(temperature) + ' °F';
                currentWindSpeed.innerHTML = 'Wind Speed: ' + Math.round(windSpeed) + ' mph';
                currentDescription.innerHTML = summary;
                //check for alerts
                if(weatherData.alerts){
                    alerts.innerHTML = weatherData.alerts[0].description;
                }
                
                
                //get alerts
                // alerts.innerHTML = weatherData.alerts[0].description;
                // wind bearing conversion
                function getDirection(windBearing){
                if(windBearing >= 348.75 || windBearing <= 11.25){
                    windBearing = 'N'
                }
                else if(windBearing > 11.25 && windBearing <= 33.75){
                    windBearing = 'NNE'
                }
                else if(windBearing > 33.75 && windBearing <= 56.25){
                    windBearing = 'NE'
                }
                else if(windBearing > 56.25 && windBearing <= 78.75){
                    windBearing = 'ENE'
                }
                else if(windBearing > 78.75 && windBearing <=101.25){
                    windBearing = 'E';
                }
                else if(windBearing > 101.25 && windBearing <=123.75){
                    windBearing = 'ESE';
                }
                else if(windBearing > 123.75 && windBearing <=146.25){
                    windBearing = 'SE';
                }
                else if(windBearing > 146.25 && windBearing <=168.75){
                    windBearing = 'SSE';
                }
                else if(windBearing > 168.75 && windBearing <=191.25){
                    windBearing = 'S';
                }
                else if(windBearing > 191.25 && windBearing <=213.75){
                    windBearing = 'SSW';
                }
                else if(windBearing > 213.75 && windBearing <=236.25){
                    windBearing = 'SW';
                }
                else if(windBearing > 236.25 && windBearing <=258.75){
                    windBearing = 'WSW';
                }
                else if(windBearing > 258.75 && windBearing <=281.25){
                    windBearing = 'W';
                }
                else if(windBearing > 281.25 && windBearing <=303.75){
                    windBearing = 'WNW';
                }
                else if(windBearing > 303.75 && windBearing <=326.25){
                    windBearing = 'NW';
                }
                else if(windBearing > 326.25 && windBearing <=348.75){
                    windBearing = 'NW';
                }
                return windBearing;   
            }

                //date
                let d = new Date();


                let weekDay = ["Sunday", 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
                                'Monday', 'Tuesday', 'Wednesday', 'Thursday']
                let fiveDay = document.querySelectorAll('.five-day');

            
                dateToday.innerHTML = moment().utcOffset(weatherData.offset).format('dddd,' + ' ' +'MMM' + ' ' + 'DD');
                //five day days
                // day 0
                let {temperatureHigh, temperatureLow} = weatherData.daily.data[0];
                let windSpeedOne = weatherData.daily.data[0].windSpeed;

                one.innerHTML = `
                <h4>${weekDay[d.getDay()]}</h4>
                <p>Hi Temp: ${Math.round(temperatureHigh)} °F</p>
                <p>Low Temp: ${Math.round(temperatureLow)} °F</p>
                <p>Wind Speed: ${Math.round(windSpeedOne)} mph</p>
                <p>Wind Direction: ${getDirection(weatherData.daily.data[0].windBearing)} </p>
                <p>${weatherData.daily.data[0].summary}</p>
                `
                

                // forecast days
                let dayNum = 0;
                fiveDay.forEach(function(fd) {
                    let newDay = weekDay[d.getDay() + dayNum];

                    //day of week
                    fd.innerHTML = `<h4>${newDay}</h4>`;
              

                    dayNum ++;
                    
                   }); 

         
                    // forecast data
                   // high temp
                   let forecastDataHigh = document.querySelectorAll('.data-high');
                   let dataNum = 1;

                   forecastDataHigh.forEach(function(fDH){
                    fDH.innerHTML = `High Temp: ${Math.round(weatherData.daily.data[dataNum].temperatureHigh)} °F <br>`

                    dataNum ++;

                   });

                   // low temp
            
                   let forecastDataLow = document.querySelectorAll('.data-low');
                   let lowNum = 1;
                   forecastDataLow.forEach(function(fDL){
                    fDL.innerHTML = `Low Temp: ${Math.round(weatherData.daily.data[lowNum].temperatureLow)} °F <br>`

                    lowNum ++;
                   });

                   // wind speed

                   let forecastWindSpeed = document.querySelectorAll('.data-speed');
                   let speedNum = 1;
                   forecastWindSpeed.forEach(function(speed){
                    speed.innerHTML = `Wind Speed: ${Math.round(weatherData.daily.data[speedNum].windSpeed)} mph <br>`

                    speedNum++;
                   });

                   // summary
                   let fiveDayDescription = document.querySelectorAll('.data-description');
                   let descNum = 1;
                   fiveDayDescription.forEach(function(fiveDay){
                       fiveDay.innerHTML = weatherData.daily.data[descNum].summary;
                       descNum++;
                   })
                   
        
                    if(weatherData.currently.icon === "clear-day"){
                        iOne.src = 'icons/clearsky.webp';
                    } else if(weatherData.currently.icon ==="clear-night"){
                        iOne.src = 'icons/clearskynight.webp';
                    } else if(weatherData.currently.icon ==="rain"){
                        iOne.src = 'icons/rain.jpg';
                    } else if(weatherData.currently.icon ==="snow") {
                        iOne.src = 'icons/snow.png';
                    } else if(weatherData.currently.icon ==="wind"){
                        iOne.src = 'icons/wind.png';
                    } else if (weatherData.currently.icon ==="fog"){
                        iOne.src = 'icons/fog.webp';
                    } else if (weatherData.currently.icon === "cloudy"){
                        iOne.src = 'icons/cloudy.webp';
                    } else if (weatherData.currently.icon ==='partly-cloudy-day'){
                        iOne.src = 'icons/partlycloudyday.webp';
                    } else if (weatherData.currently.icon ==='partly-cloudy-night'){
                        iOne.src = 'icons/partlycloudynight.webp';
                    } else if (weatherData.currently.icon ==='sleet'){
                        iOne.src = 'icons/sleet.webp';
                    }
                    if(weatherData.daily.data[1].icon === "clear-day"){
                        iTwo.src = 'icons/clearsky.webp';
                    } else if(weatherData.daily.data[1].icon ==="clear-night"){
                        iTwo.src = 'icons/clearskynight.webp';
                    } else if(weatherData.daily.data[1].icon ==="rain"){
                        iTwo.src = 'icons/rain.jpg';
                    } else if(weatherData.daily.data[1].icon ==="snow") {
                        iTwo.src = 'icons/snow.png';
                    } else if(weatherData.daily.data[1].icon ==="wind"){
                        iTwo.src = 'icons/wind.png';
                    } else if (weatherData.daily.data[1].icon ==="fog"){
                        iTwo.src = 'icons/fog.webp';
                    } else if (weatherData.daily.data[1].icon === "cloudy"){
                        iTwo.src = 'icons/cloudy.webp';
                    } else if (weatherData.daily.data[1].icon ==='partly-cloudy-day'){
                        iTwo.src = 'icons/partlycloudyday.webp';
                    } else if (weatherData.daily.data[1].icon ==='partly-cloudy-night'){
                        iTwo.src = 'icons/partlycloudynight.webp';
                    } else if (weatherData.daily.data[1].icon ==='sleet'){
                        iTwo.src = 'icons/sleet.webp';
                    }
                    if(weatherData.daily.data[2].icon === "clear-day"){
                        iThree.src = 'icons/clearsky.webp';
                    } else if(weatherData.daily.data[2].icon ==="clear-night"){
                        iThree.src = 'icons/clearskynight.webp';
                    } else if(weatherData.daily.data[2].icon ==="rain"){
                        iThree.src = 'icons/rain.jpg';
                    } else if(weatherData.daily.data[2].icon ==="snow") {
                        iThree.src = 'icons/snow.png';
                    } else if(weatherData.daily.data[2].icon ==="wind"){
                        iThree.src = 'icons/wind.png';
                    } else if (weatherData.daily.data[2].icon ==="fog"){
                        iThree.src = 'icons/fog.webp';
                    } else if (weatherData.daily.data[2].icon === "cloudy"){
                        iThree.src = 'icons/cloudy.webp';
                    } else if (weatherData.daily.data[2].icon ==='partly-cloudy-day'){
                        iThree.src = 'icons/partlycloudyday.webp';
                    } else if (weatherData.daily.data[2].icon ==='partly-cloudy-night'){
                        iThree.src = 'icons/partlycloudynight.webp';
                    } else if (weatherData.daily.data[2].icon ==='sleet'){
                        iThree.src = 'icons/sleet.webp';
                    }
                    
                    if(weatherData.daily.data[3].icon === "clear-day"){
                        iFour.src = 'icons/clearsky.webp';
                    } else if(weatherData.daily.data[3].icon ==="clear-night"){
                        iFour.src = 'icons/clearskynight.webp';
                    } else if(weatherData.daily.data[3].icon ==="rain"){
                        iFour.src = 'icons/rain.jpg';
                    } else if(weatherData.daily.data[3].icon ==="snow") {
                        iFour.src = 'icons/snow.png';
                    } else if(weatherData.daily.data[3].icon ==="wind"){
                        iFour.src = 'icons/wind.png';
                    } else if (weatherData.daily.data[3].icon ==="fog"){
                        iFour.src = 'icons/fog.webp';
                    } else if (weatherData.daily.data[3].icon === "cloudy"){
                        iFour.src = 'icons/cloudy.webp';
                    } else if (weatherData.daily.data[3].icon ==='partly-cloudy-day'){
                        iFour.src = 'icons/partlycloudyday.webp';
                    } else if (weatherData.daily.data[3].icon ==='partly-cloudy-night'){
                        iFour.src = 'icons/partlycloudynight.webp';
                    } else if (weatherData.daily.data[3].icon ==='sleet'){
                        iFour.src = 'icons/sleet.webp';
                    }
                    if(weatherData.daily.data[4].icon === "clear-day"){
                        iFive.src = 'icons/clearsky.webp';
                    } else if(weatherData.daily.data[4].icon ==="clear-night"){
                        iFive.src = 'icons/clearskynight.webp';
                    } else if(weatherData.daily.data[4].icon ==="rain"){
                        iFive.src = 'icons/rain.jpg';
                    } else if(weatherData.daily.data[4].icon ==="snow") {
                        iFive.src = 'icons/snow.png';
                    } else if(weatherData.daily.data[4].icon ==="wind"){
                        iFive.src = 'icons/wind.png';
                    } else if (weatherData.daily.data[4].icon ==="fog"){
                        iFive.src = 'icons/fog.webp';
                    } else if (weatherData.daily.data[4].icon === "cloudy"){
                        iFive.src = 'icons/cloudy.webp';
                    } else if (weatherData.daily.data[4].icon ==='partly-cloudy-day'){
                        iFive.src = 'icons/partlycloudyday.webp';
                    } else if (weatherData.daily.data[4].icon ==='partly-cloudy-night'){
                        iFive.src = 'icons/partlycloudynight.webp';
                    } else if (weatherData.daily.data[4].icon ==='sleet'){
                        iFive.src = 'icons/sleet.webp';
                    }
            

                   //wind direction

                   let forecastWindDirection = document.querySelectorAll('.data-direction');
                   let dirNum = 1;
                   forecastWindDirection.forEach(function(direction){
                    direction.innerHTML = `Wind Direction: ${getDirection(weatherData.daily.data[dirNum].windBearing)}<br>`

                    dirNum ++;
                   })
              




                   currentWindDirection.innerHTML = 'Wind Direction: ' + getDirection(windBearing);
                   getCurrentIcon();

                //choose icon for current weather
                function getCurrentIcon(){
                if(weatherData.currently.icon === "clear-day"){
                    currentIcon.src = 'icons/clearsky.webp';
                } else if(weatherData.currently.icon ==="clear-night"){
                    currentIcon.src = 'icons/clearskynight.webp';
                } else if(weatherData.currently.icon ==="rain"){
                    currentIcon.src = 'icons/rain.jpg';
                } else if(weatherData.currently.icon ==="snow") {
                    currentIcon.src = 'icons/snow.png';
                } else if(weatherData.currently.icon ==="wind"){
                    currentIcon.src = 'icons/wind.png';
                } else if (weatherData.currently.icon ==="fog"){
                    currentIcon.src = 'icons/fog.webp';
                } else if (weatherData.currently.icon === "cloudy"){
                    currentIcon.src = 'icons/cloudy.webp';
                } else if (weatherData.currently.icon ==='partly-cloudy-day'){
                    currentIcon.src = 'icons/partlycloudyday.webp';
                } else if (weatherData.currently.icon ==='partly-cloudy-night'){
                    currentIcon.src = 'icons/partlycloudynight.webp';
                } else if (weatherData.currently.icon ==='sleet'){
                    currentIcon.src = 'icons/sleet.webp';
                }
            }



            function getTime(){
                let now = moment().utcOffset(weatherData.offset);

                    clock.innerText = now.format('h:mm:ssA');
                    setInterval(getTime, 1000)
            }
        
            getTime()
    
            typeSearch.value = '';

         
            }
