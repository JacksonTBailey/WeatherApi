const fahrenheit= document.getElementById('tempF')
const celcius= document.getElementById('tempC')
const dayOfTheWeek=document.getElementById('dayOfTheWeek')
const weatherDay=document.getElementById('weatherDay')
const imageOfWeather=document.getElementById('imageOfWeather')
const key=myApi.apiKey
const btn=document.getElementsByClassName('weatherButton')

btn.addEventListener("click", ()=>{
    if(btn.value==="Fahrenheit"){
        btn.value==="Celcius";
    } else{
        btn.value==="Fahrenheit";
    }
})



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
  
async function writeWeatherToScreen() {
    //Remove previous options
    clearScreenOptions();

    let weatherDataFahrenheit = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=34.9386111&lon=-82.2272222&units=imperial&exclude=hourly&appid=${key}`).then(response=>response.json())
    const periods = weatherDataFahrenheit.daily;
    let currentDay=0;
    let everyDay=[];
    
    for(i=1; i<periods.length; i++){
            everyDay.push(i)
    }

    let current= await createCurrentDayWeather(currentDay);
    weatherDay.append(current);
    //Create and add each option to the screen
    everyDay.forEach(async day =>{
        const div = await createWeeklyWeather(day);
        weatherDay.append(div)
    });
  };

  async function createCurrentDayWeather(day) {
    const div = document.createElement('div');
    const city = document.createElement('p')
    const description= document.createElement('p')
    const tempF = document.createElement('p');
    const tempC = document.createElement('p');
    const tempConverter = document.createElement('button')
    const wd = document.createElement('p');
    const img = document.createElement('img')
  
    tempF.innerText= await callFahrenheit(day);
    tempC.innerText= await callCelcius(day);
    tempConverter.innerText= "Fahrenheit";
    city.innerText = await callCity(day);
    description.innerText = await callDescription(day);
    wd.innerText = await callDays(day);
    img.src= await weatherImage(day);

    div.classList.add(`weatherDiv`,`weatherDiv${day}`)
    city.classList.add(`weatherCity`, `weatherCity${day}`)
    description.classList.add(`weatherDescription`, `weatherDescription${day}`)
    tempF.classList.add(`weatherTempF`, `weatherTempF${day}`)
    tempC.classList.add(`weatherTempC`, `weatherTempC${day}`)
    tempConverter.classList.add(`weatherButton`, `weatherButton${day}`)
    wd.classList.add(`weatherWd`, `weatherWd${day}`)
    img.classList.add(`weatherImage, weatherImage${day}`)

    div.appendChild(img)
    div.appendChild(description)
    div.appendChild(wd)
    div.appendChild(city)
    div.appendChild(tempF)
    div.appendChild(tempC)
    div.appendChild(tempConverter)
  
    return div;
  }  
  

async function createWeeklyWeather(day) {
    const div = document.createElement('div');
    const temp = document.createElement('p');
    const wd = document.createElement('p');
    const img = document.createElement('img')
  
    temp.innerText= await callTemperature(day);
    wd.innerText = await callDays(day)
    img.src= await weatherImage(day)

    console.log(img.src,temp.innerText,wd.innerText);


    div.classList.add(`weatherDiv`,`weatherDiv${day}`)
    img.classList.add(`weatherImage`, `weatherImage${day}`)
    temp.classList.add(`weatherTemp`, `weatherTemp${day}`)
    wd.classList.add(`weatherWd`, `weatherWd${day}`)

    div.appendChild(img)
    div.appendChild(temp)
    div.appendChild(wd)
  
    return div;
  }

async function callCelcius(time){
    let weatherDataCelcius = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=34.9386111&lon=-82.2272222&units=metric&exclude=hourly&appid=${key}`).then(response=>response.json())
    let tempC=Math.round(weatherDataCelcius.daily[time].temp.day)
    let celcius= `${tempC}\xB0`
    return celcius;

}

async function callFahrenheit(time){
    let weatherDataFahrenheit = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=34.9386111&lon=-82.2272222&units=imperial&exclude=hourly&appid=${key}`).then(response=>response.json())
    let tempF=Math.round(weatherDataFahrenheit.daily[time].temp.day)
    let fahrenheit= `${tempF}\xB0`
    return fahrenheit;

}

async function callDays(time){
    let weatherDataFahrenheit = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=34.9386111&lon=-82.2272222&units=imperial&exclude=hourly&appid=${key}`).then(response=>response.json())
    //console.log(forcast);
    let epoch=weatherDataFahrenheit.daily[time].dt
    let date = new Date(epoch*1000);
    let finalDate=new Intl.DateTimeFormat('en-US', {dateStyle: 'full'}).format(date);

    return finalDate;
    
}

async function weatherImage(time){
    let weatherDataFahrenheit = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=34.9386111&lon=-82.2272222&units=imperial&exclude=hourly&appid=${key}`).then(response=>response.json())
    let weatherIcon= `http://openweathermap.org/img/wn/${weatherDataFahrenheit.daily[time].weather[0].icon}@2x.png`;

    return(weatherIcon);

}


writeWeatherToScreen()



