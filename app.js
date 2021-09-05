const fahrenheit= document.getElementById('tempF')
const celcius= document.getElementById('tempC')
const dayOfTheWeek=document.getElementById('dayOfTheWeek')
const weatherDay=document.getElementById('weatherDay')
const imageOfWeather=document.getElementById('imageOfWeather')
const key = config.My_API_Key;

const weatherDaysArray=[7,1,2,3,4,5,6]

function writeFahrenheitToScreen(text) {
    fahrenheit.innerText = text;
  };
  
function writeCelciusToScreen(text) {
    celcius.innerText = text;
  };

function writeDayToScreen(text) {
    dayOfTheWeek.innerText = text;
  };

function writeImageToScreen(text) {
    imageOfWeather.innerText = text;
  };  
  
function clearScreenOptions() {
    while(weatherDay.firstChild){
      weatherDay.removeChild(weatherDay.firstChild);
    }
  };
  
function writeWeatherToScreen(everyDay) {
    //Remove previous options
    clearScreenOptions();
  
    //Create and add each option to the screen
    everyDay.forEach(async day =>{
        const div = await createWeather(day);
        weatherDay.append(div)
    });
  };
  
async function createWeather(day) {
    const div = document.createElement('div');
    const fa = document.createElement('p');
    const ce = document.createElement('p');
    const wd = document.createElement('p');
    const img = document.createElement('img')
  
    fa.innerText= await callFahrenheit(day);
    ce.innerText = await callCelcius(day);
    wd.innerText = await callDays(day)
    img.src= await weatherImage(day)
    console.log(img.src, fa.innerText, ce.innerText, wd.innerText,);
    
    div.appendChild(img)
    div.appendChild(fa)
    div.appendChild(ce)
    div.appendChild(wd)
  
    return div;
  }

async function callFahrenheit(time){
    let weatherDataFahrenehit = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=34.9386111&lon=-82.2272222&units=imperial&exclude=hourly&appid=${key}`).then(response=>response.json())
    let ftemp=weatherDataFahrenehit.daily[time].temp.day
    console.log(ftemp);
    return ftemp;
}

async function callCelcius(time){
    let weatherDataCelcius = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=34.9386111&lon=-82.2272222&units=metric&exclude=hourly&appid=${key}`).then(response=>response.json())
    let ctemp=weatherDataCelcius.daily[time].temp.day
    console.log(ctemp);
    return ctemp;
}

async function callDays(time){
    let weatherDataDays = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=34.9386111&lon=-82.2272222&units=imperial&exclude=hourly&appid=${key}`).then(response=>response.json())
    console.log(weatherDataDays);
    let unixTimestamp = weatherDataDays.daily[time].dt
    let date = new Date(unixTimestamp * 1000);
    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDay();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    let weekDay = new Date(Date.UTC(year, month, day, hours, minutes,seconds))
    let longWeekDay={weekday:'long', year:'numeric',month:'long', day:'numeric'};
    // let currentDate = (month+'/'+day+'/'+year+' '+hours+':'+minutes+':'+seconds);

    return weekDay.toLocaleDateString('en-US',longWeekDay);
    
}

async function weatherImage(time){
    let weatherDataImages = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=34.9386111&lon=-82.2272222&units=imperial&exclude=hourly&appid=${key}`).then(response=>response.json())
    let weatherIcon = weatherDataImages.daily[time].weather[0].icon
    console.log(weatherIcon);
    let icon = `http://openweathermap.org/img/wn/${weatherIcon}@2x.png`
    return(icon);

}

writeWeatherToScreen(weatherDaysArray)
