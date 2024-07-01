"use strict"
// Api = https://api.weatherapi.com/v1/forecast.json?key=1953dc99c2e348fd8b205549242906&q=London&days=3&aqi=no&alerts=no
// search input
let search = document.querySelector(".search input")
let getLocalLoction = document.querySelector(".currentLocation")
// Today Elments
let todayName = document.querySelector(".tody-Name");
let todayDate = document.querySelector(".tody-dates");
let countryName = document.querySelectorAll(".country_name");
let todayTemp = document.querySelector(".today-temp");
let todayIcon = document.querySelector(".today-icon");
let todayWeather = document.querySelector(".tody-weather"); // نص حالة الطقس مثال (مشمس)
// today footer
let todayMoisture = document.querySelector(".moisture_value");
// 
let todayWinds = document.querySelector(".winds_value");
// 
let todayDirection = document.querySelector(".direction_value");
// Next Date
let nextDayName = document.getElementsByClassName("next-day-name")
let nextTempDate = document.getElementsByClassName("nextTemp-date")
let nextWeather = document.getElementsByClassName("next-weather")
let nextDayIcon = document.getElementsByClassName("next-day-icon")
let nexLowTemp = document.getElementsByClassName("low_temperature__Value")
// error masge
let errorMsg = document.querySelector(".error")
// Fetch From Api Date
async function getWeatherDate(cityName){
    let weatherResponse =  await fetch (`https://api.weatherapi.com/v1/forecast.json?key=1953dc99c2e348fd8b205549242906&q=${cityName}&days=3&aqi=no&alerts=no`)
    let weatherDate = await weatherResponse.json()
    return weatherDate
}
let cityName = '';
search.addEventListener("input", function serchContry() {
    cityName = search.value.trim(); // قم بتحديث قيمة cityName عندما يتم إدخال بحث جديد
    callAllDate(cityName); // استدعاء callAllDate مع القيمة الجديدة ل cityName
});
// Display Today Date
function displayTodayDate(date) {
    todayName.innerHTML = new Date  (date.forecast.forecastday[0].date).toLocaleDateString('en-US', { weekday: 'long' });
    todayDate.innerHTML = date.forecast.forecastday[0].date
    countryName.forEach(element => {element.innerHTML = date.location.name;});    // work in all cards loction name 
    todayTemp.innerHTML = date.current.temp_c
    todayIcon.setAttribute("src",date.current.condition.icon) 
    todayWeather.innerHTML = date.current.condition.text
    todayMoisture.innerHTML = date.current.humidity
    todayWinds.innerHTML = date.current.wind_kph + "km/h"
    const directionMap = {
        N: "North",
        NNE: "North North East",
        NE: "North-East",
        ENE: "East North East",
        E: "East",
        ESE: "East South East",
        SE: "South East",
        SSE: "South South East",
        S: "South",
        SSW: "South South West",
        SW: "South West",
        WSW: "West South West",
        W: "West",
        WNW: "West North-West",
        NW: "North West",
        NNW: "North North West"
    };
    let actualDirection = directionMap[date.current.wind_dir];
    todayDirection.innerHTML = actualDirection
}
// Deisplay Next Days Dates
function displayNextDates(date) {
    let forecastDate = date.forecast.forecastday;
    for (let i = 1; i <= 2; i++) { 
        nextDayName[i-1].innerHTML = new Date(forecastDate[i].date).toLocaleDateString('en-US', { weekday: 'long' });
        nextTempDate[i-1].innerHTML = forecastDate[i].day.maxtemp_c;
        nextWeather[i-1].innerHTML = forecastDate[i].day.condition.text;
        nextDayIcon[i-1].setAttribute("src", forecastDate[i].day.condition.icon); 
        nexLowTemp[i-1].innerHTML = forecastDate[i].day.mintemp_c;
    }
}

async function fetchIPData() {
    const apiKey = 'ddb88936cd9bcef4c2c5d22b93b552e4f327b3cbfd4e586ac7a55030'; // Replace with your ipdata.co API key
    const ipAddress = ''; // Leave empty to let ipdata.co detect visitor's IP automatically

    try {
        const response = await fetch(`https://api.ipdata.co/${ipAddress}?api-key=${apiKey}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.country_name; // Return country_name
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}
// Call All Dates
async function callAllDate (cityName) {
    const ipcountryName = await fetchIPData();
    if (cityName === ""){
        cityName = ipcountryName;
    }
    console.log(cityName);
    let weatherDate = await getWeatherDate(cityName)
    if (!weatherDate.error){
        displayTodayDate(weatherDate)
        displayNextDates(weatherDate)
        errorMsg.classList.add('d-none')
    }else
    {
        errorMsg.classList.remove('d-none')
    }

}
callAllDate(cityName);
getLocalLoction.addEventListener("click", async function currentlocation(){
    const ipcountryName = await fetchIPData();
    console.log(ipcountryName);
    callAllDate(ipcountryName); 
    search.value = null
})