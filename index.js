/*

const apikey = "c31c38a511e8121c7f183f7881d84ebf"

function renderWeatherInfo(data) {
    let newPara = document.createElement('p')
    newPara.textContent = `${data?.main?.temp.toFixed(2)} C`
    document.body.appendChild(newPara)

}


async function fetchWeatherDetails() {
    let city = "noida"
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&units=metric`)
    const data = await response.json()
    console.log("Weather data:-> ", data)
    renderWeatherInfo(data)
}

async function getCustomweatherDetails() {
    try {
        let latitude = 201.912
        let longitude = 31.982
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apikey}`)
        let data = await response.json()
        console.log(data)
    }
    catch (err) {
        console.log("Error Found")
    }
}

function getLocation()
{
    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showPosition)
    }
    else{

        console.log("No geolocation support")
    }
}

function showPosition(position){
    let lat = position.coords.latitude
    let longi = position.coords.longitude

    console.log(lat)
    console.log(longi)
}

*/


const userTab = document.querySelector("[data-userWeather]")
const searchTab = document.querySelector("[data-searchWeather]")
const userContainer = document.querySelector(".weather-container")
const grantAccessContainer = document.querySelector(".grant-location-container")
const searchform = document.querySelector("[data-searchForm]")
const loadingScreen = document.querySelector(".loading-container")
const userInfoContainer = document.querySelector(".user-info-container")
const erth = document.querySelector(".errorthrow")



let currentTab = userTab
const apikey = "c31c38a511e8121c7f183f7881d84ebf"
currentTab.classList.add("current-tab")


getfromSessionStorage()


function switchTab(clickedTab) {
    if (clickedTab != currentTab) {
        erth.classList.remove("active")
        currentTab.classList.remove("current-tab")
        currentTab = clickedTab
        currentTab.classList.add("current-tab")

        if (!searchform.classList.contains("active")) {
            userInfoContainer.classList.remove("active")
            grantAccessContainer.classList.remove("active")
            searchform.classList.add("active")
        }
        else {
            searchform.classList.remove("active")
            userInfoContainer.classList.remove("active")
            getfromSessionStorage();
        }
    }
}


userTab.addEventListener('click', () => {
    switchTab(userTab)
})

searchTab.addEventListener("click", () => {
    switchTab(searchTab)
})

function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates")
    if (!localCoordinates) {
        grantAccessContainer.classList.add("active")
    }
    else {
        const coordinates = JSON.parse(localCoordinates)
        fetchUserWeatherInfo(coordinates)
    }

}

async function fetchUserWeatherInfo(coordinates) {
    const { lat, lon } = coordinates

    grantAccessContainer.classList.remove("active")

    loadingScreen.classList.add("active")

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}&units=metric`)
        const data = await response.json()
        loadingScreen.classList.remove("active")
        userInfoContainer.classList.add("active")
        renderWeatherInfo(data)
    }
    catch (err) {

        console.log("Error!")
    }

}

function renderWeatherInfo(weatherInfo) {

    const cityName = document.querySelector("[data-cityName]")
    const countryIcon = document.querySelector("[data-countryIcon]")
    const desc = document.querySelector("[data-weatherDesc]")
    const weatherIcon = document.querySelector("[data-weatherIcon]")
    const temp = document.querySelector("[data-temp]")
    const windspeed = document.querySelector("[data-windspeed]")
    const humidity = document.querySelector("[data-humidity]")
    const cloudiness = document.querySelector("[data-cloudiness]")

    console.log(weatherInfo);

    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`
    desc.innerText = weatherInfo?.weather?.[0]?.description
    weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`

    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;


}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition)
    }
    else {

        console.log("No geolocation support")
    }
}


function showPosition(position) {

    const userCoordinates = {
        lat: position.coords.latitude
        , lon: position.coords.longitude
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates))
    fetchUserWeatherInfo(userCoordinates)
}


const grantAccessButton = document.querySelector("[data-grantAccess]")

grantAccessButton.addEventListener("click", getLocation)



const searchInput = document.querySelector("[data-searchInput]")
searchform.addEventListener("submit", (e) => {
    e.preventDefault()
    let cityName = searchInput.value
    if (cityName === "")
        return
    else
        fetchSearchWeatherInfo(cityName)
})


async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active")
    userInfoContainer.classList.remove("active")
    grantAccessContainer.classList.remove("active")
    
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&units=metric`)

        const data = await response.json()
        loadingScreen.classList.remove("active")
        if(data.cod==404)
        {
           erth.classList.add("active")
            console.log(data.message)
            console.log("error")
        }
       else
       {
        userInfoContainer.classList.add("active")
        renderWeatherInfo(data)
       }
    
    

}