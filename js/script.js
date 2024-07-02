"use strict"
// Api = https://api.weatherapi.com/v1/forecast.json?key=1953dc99c2e348fd8b205549242906&q=London&days=3&aqi=no&alerts=no
// search input
const search = document.querySelector(".search input")
const getLocalLoction = document.querySelector(".currentLocation")
// Today Elments
const todayName = document.querySelector(".tody-Name");
const todayDate = document.querySelector(".tody-dates");
const countryName = document.querySelectorAll(".country_name");
const todayTemp = document.querySelector(".today-temp");
const todayIcon = document.querySelector(".today-icon");
const todayWeather = document.querySelector(".tody-weather"); // نص حالة الطقس مثال (مشمس)
// today footer
const todayMoisture = document.querySelector(".moisture_value");
// 
const todayWinds = document.querySelector(".winds_value");
// 
const todayDirection = document.querySelector(".direction_value");
// Next Date
const nextDayName = document.getElementsByClassName("next-day-name")
const nextTempDate = document.getElementsByClassName("nextTemp-date")
const nextWeather = document.getElementsByClassName("next-weather")
const nextDayIcon = document.getElementsByClassName("next-day-icon")
const nexLowTemp = document.getElementsByClassName("low_temperature__Value")
// error masge
const errorMsg = document.querySelector(".error")
const kay = "1953dc99c2e348fd8b205549242906"
const api = `https://api.weatherapi.com/v1/forecast.json?key=${kay}&q=`
// Fetch From Api Date
async function getWeatherDate(cityName){
    let weatherResponse =  await fetch (`${api}${cityName}&days=3&aqi=no&alerts=no`)
    let weatherDate = await weatherResponse.json()
    return weatherDate
}
let cityName = '';
search.addEventListener("input", function serchContry() {
    cityName = search.value.trim(); 
    callAllDate(cityName); 
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
    const ipAddress = ''; // الايبي هيتجاب هنا من api
    try {
        const response = await fetch(`https://api.ipdata.co/${ipAddress}?api-key=${apiKey}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.country_name; 
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
     const ipcountryName = await fetchIPData(); // بلد الشخص الحاليه
    console.log(ipcountryName);
    callAllDate(ipcountryName); 
    search.value = null
})
