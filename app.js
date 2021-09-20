const fahrenheit= document.getElementById('tempF')
const celcius= document.getElementById('tempC')
const dayOfTheWeek=document.getElementById('dayOfTheWeek')
const weatherDay=document.getElementById('weatherDay')
const imageOfWeather=document.getElementById('imageOfWeather')
const btn=document.getElementsByClassName('weatherButton')
const wrapper = document.querySelector(".wrapper")
const searchWrapper = document.querySelector(".search-input")
const inputBox = searchWrapper.querySelector("input")
const suggBox = searchWrapper.querySelector(".autocom-box")
const icon= searchWrapper.querySelector(".fa-search-location")
let buttonTextStatus="on"

const key=myApi.apiKey
let cityName;
let lat
let long

window.onload = checkLocalStorage();
async function checkLocalStorage() {
  if("localLong" in localStorage && "localLat" in localStorage && "weatherData" in localStorage){
    let lat = JSON.parse(localStorage.getItem("localLat")).cityLat
    let long = JSON.parse(localStorage.getItem("localLong")).cityLong 
    console.log(long, lat)
    let getData = await fetch(`https://api.teleport.org/api/locations/${lat},${long}/`).then(response=>response.json())
    console.log(getData)
    cityName=getData["_embedded"]["location:nearest-cities"][0]["_links"]["location:nearest-city"].name
    wrapper.style.display="none"
    writeWeatherToScreen()
  }
  else{
    console.log("Still need data")
    console.log(localStorage)
  }
}

//If user presses any key in the search bar and releases, it will display suggestions
inputBox.onkeyup = async (e)=>{
    let userData=e.target.value;
    let userEnter=e.key; //user entered data
    console.log(userEnter);
    let emptyArray= [];
    let suggestions = await citySuggestions(userData)
    
    //If Enter is pressed, it takes the input with a class of .item0 and performs callCity and writeWeatherToScreen
    if(userEnter==="Enter"){
        console.log("performing userEnter");
        await select(userEnter)
    } else if(userData){
        emptyArray = suggestions.filter((data)=>{
            //filtering array value and user characters to lowercase and returning only those places which starts with whatever user typed.
            return data.toLocaleLowerCase().startsWith(userData.toLocaleLowerCase());
        })
        emptyArray=emptyArray.map((data)=>{
            return data = '<li>'+ data +'</li>';
        })
        console.log(emptyArray);
        searchWrapper.classList.add("active") //shows autocomplete box
        showSuggestions(emptyArray);
        let allList = suggBox.querySelectorAll("li")
        for(let i = 0; i < allList.length; i++){
            allList[i].setAttribute("onclick", "select(this)")
            allList[i].classList.add(`item${i}`)
        }
    } else{
        searchWrapper.classList.remove("active") //hides autocomplete box
    } 
}

async function select(element) {
    let selectUserData=element.textContent;
    if(element===icon){
        inputBox.value= document.querySelector(".item0").textContent
        console.log(inputBox.value);
        searchWrapper.classList.remove("active")
        await callCity(inputBox.value)
        wrapper.style.display="none"
        await writeWeatherToScreen()

    }else if(element ==="Enter"){
            inputBox.value= document.querySelector(".item0").textContent
            console.log(inputBox.value);
            searchWrapper.classList.remove("active")
            await callCity(inputBox.value)
            wrapper.style.display="none"
            await writeWeatherToScreen()
    }else{
        inputBox.value = selectUserData;
        searchWrapper.classList.remove("active")
        await callCity(selectUserData)
        wrapper.style.display="none"
        await writeWeatherToScreen()
    }

}

function showSuggestions(list){
    let listData;
    if(!list.length){
        userValue = inputBox.value;
        listData = '<li>'+userValue+'</li>';
    }else{
        listData = list.join('');
    }
    suggBox.innerHTML = listData
}

// Changes weather button from the text fahrenheit to celcius
function theOlSwitcherroo(){
  let wButton = document.querySelector(".weatherButton")
  let tempFar = document.querySelectorAll(".weatherTempF")
  let tempCel = document.querySelectorAll(".weatherTempC")
  switch(buttonTextStatus){
    case "on":
      buttonTextStatus="off";
      wButton.innerText ="Celcius";
      [...tempFar].forEach((temp)=>temp.style.display="none");
      [...tempCel].forEach((temp)=>temp.style.display="block");
      break;
    case "off":
      buttonTextStatus="on";
      wButton.innerText="Fahrenheit";
      [...tempFar].forEach((temp)=>temp.style.display="block");
      [...tempCel].forEach((temp)=>temp.style.display="none");
      break;
  }
}

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

async function locationToLocalStorage(){
  Date.prototype.getDOY = function() {
    var onejan = new Date(this.getFullYear(),0,1);
    return Math.ceil((this - onejan) / 86400000);
  }
  
  var today = new Date();
  let finalDate=new Intl.DateTimeFormat('en-US', {dateStyle: 'full'}).format(today);
  console.log(finalDate)
  if (localStorage.getItem("weatherData")===null && await callDays(0) !== finalDate ){
    let weatherDataFahrenheit = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&units=imperial&exclude=hourly&appid=${key}`).then(response=>response.json())
    const weatherData = {
      weather: weatherDataFahrenheit
    }
    const jsonObj = JSON.stringify(weatherData);
    localStorage.setItem("weatherData", jsonObj);
  }
} 
  
async function writeWeatherToScreen() {
    //Remove previous options
    clearScreenOptions();
    
    if (localStorage.getItem("weatherData")===null){
      let weatherDataFahrenheit = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&units=imperial&exclude=hourly&appid=${key}`).then(response=>response.json())
      const weatherData = {
        weather: weatherDataFahrenheit
      }
      const jsonObj = JSON.stringify(weatherData);
      localStorage.setItem("weatherData", jsonObj);
    }

    const str = localStorage.getItem("weatherData");
    const parsedObj = JSON.parse(str);
    const periods = parsedObj.weather.daily;
    console.log(periods);
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
    const city = document.createElement('p');
    const description= document.createElement('p');
    const tempF = document.createElement('p');
    const tempC = document.createElement('p');
    const tempConverter = document.createElement('button');
    const wd = document.createElement('p');
    const img = document.createElement('img');
  
    tempF.innerText= await callFahrenheit(day);
    tempC.innerText= await callCelcius(day);
    tempConverter.innerText= "Fahrenheit";
    tempConverter.value="Fahrenheit";
    tempConverter.type="button"
    tempConverter.setAttribute("onclick", "theOlSwitcherroo()")
    city.innerText = cityName;
    description.innerText = await callDescription(day);
    wd.innerText = await callDays(day);
    img.src= await weatherImage(day);

  console.log(tempF.innerText, tempC.innerText, tempConverter.innerText,city.innerText, description.innerText, wd.innerText, img.src);

    div.classList.add(`weatherDiv`,`weatherDiv${day}`)
    city.classList.add(`weatherCity`, `weatherCity${day}`)
    tempF.classList.add(`weatherTempF`, `weatherTempF${day}`)
    tempC.classList.add(`weatherTempC`, `weatherTempC${day}`)
    tempConverter.classList.add(`weatherButton`)
    description.classList.add(`weatherDescription`, `weatherDescription${day}`)
    wd.classList.add(`weatherWd`, `weatherWd${day}`)
    img.classList.add(`weatherImage`, `weatherImage${day}`)

    div.appendChild(city)
    div.appendChild(img)
    div.appendChild(tempF)
    div.appendChild(tempC)
    div.appendChild(description)
    div.appendChild(wd)
    div.appendChild(tempConverter)

    return div;
  }  
  

async function createWeeklyWeather(day) {
    const div = document.createElement('div');
    const tempF = document.createElement('p');
    const tempC = document.createElement('p');
    const wd = document.createElement('p');
    const img = document.createElement('img')
  
    tempF.innerText= await callFahrenheit(day);
    tempC.innerText= await callCelcius(day);
    wd.innerText = await callDays(day)
    img.src= await weatherImage(day)


    div.classList.add(`weatherDiv`,`weatherDiv${day}`)
    img.classList.add(`weatherImage`, `weatherImage${day}`)
    tempF.classList.add(`weatherTempF`, `weatherTempF${day}`)
    tempC.classList.add(`weatherTempC`, `weatherTempC${day}`)
    wd.classList.add(`weatherWd`, `weatherWd${day}`)

    div.appendChild(img)
    div.appendChild(tempC)
    div.appendChild(tempF)
    div.appendChild(wd)
  
    return div;
  }

async function callCelcius(time){
  const str = localStorage.getItem("weatherData");
  const parsedObj = JSON.parse(str);
  let tempC=Math.round(((parsedObj.weather.daily[time].temp.day)-32)/1.8)
  let celcius= `${tempC}\xB0`
  return celcius;

}

async function callFahrenheit(time){
  const str = localStorage.getItem("weatherData");
  const parsedObj = JSON.parse(str);
  let tempF=Math.round(parsedObj.weather.daily[time].temp.day)
  let fahrenheit= `${tempF}\xB0`
  return fahrenheit;

}

async function callDays(time){
  const str = localStorage.getItem("weatherData");
  const parsedObj = JSON.parse(str);
  let epoch=parsedObj.weather.daily[time].dt
  let date = new Date(epoch*1000);
  let finalDate=new Intl.DateTimeFormat('en-US', {dateStyle: 'full'}).format(date);
  return finalDate;
    
}

async function weatherImage(time){
  const str = localStorage.getItem("weatherData");
  const parsedObj = JSON.parse(str);
  let weatherIcon= `http://openweathermap.org/img/wn/${parsedObj.weather.daily[time].weather[0].icon}@2x.png`;
   return weatherIcon;

}

async function callDescription(day){
  const str = localStorage.getItem("weatherData");
  const parsedObj = JSON.parse(str);
  let description = parsedObj.weather.daily[day].weather[0].description
  return description;
}

//found on developers.teleport.org/api/getting_started
async function callCity(city){
    let getData = await fetch(`https://api.teleport.org/api/cities/?search=${city}`).then(response=>response.json())
    let getCity=getData["_embedded"]["city:search-results"][0]["_links"]["city:item"].href
    let getCityData= await fetch(`${getCity}`).then(response=>response.json())
    lat = getCityData.location.latlon.latitude;
    long = getCityData.location.latlon.longitude;

    cityName=getCityData.name;

    let localLat={cityLat:getCityData.location.latlon.latitude}
    let localLong={cityLong: getCityData.location.latlon.longitude}
  
    const longObj = JSON.stringify(localLong);
    const latObj = JSON.stringify(localLat)
    localStorage.setItem("localLong", longObj);
    localStorage.setItem("localLat", latObj);
    console.log(long,lat)
    return (long, lat)

}

async function citySuggestions(city){
    let getData = await fetch(`https://api.teleport.org/api/cities/?search=${city}`).then(response=>response.json())
    let arrayOfCities=getData["_embedded"]["city:search-results"]
    let numberOfCities=[]
    let cityNames=[]

    for(i=0; i<arrayOfCities.length; i++){
        numberOfCities.push(i)
}
    numberOfCities.forEach(e => {
        const cityName= arrayOfCities[e]["matching_full_name"]
        cityNames.push(cityName)
    });
    return(cityNames);
}
