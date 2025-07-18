const API_KEY = "168771779c71f3d64106d8a88376808a";

// Tab Switching

const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]") ;
const searchForm = document.querySelector("[data-searchForm]") ;
const userInfoContainer = document.querySelector(".userInfoContainer");
const grantAccessContainer = document.querySelector(".grantAccessContainer");
const loadingContainer = document.querySelector(".loadingContainer");


const notFound = document.querySelector(".errorContainer");
const errorBtn = document.querySelector("[data-errorButton]");
const errorText = document.querySelector("[data-errorText]") ;
const errorImage = document.querySelector("[data-errorImg]") ;


let currentTab = userTab ;

currentTab.classList.add("currentTab") ;
getFromSessionStorage() ;

// console.log(userTab);
// console.log(searchTab);

function switchTab(newTab) {
    notFound.classList.remove("active") ;

        // check if newTab is already selected or not 
    if(currentTab!=newTab){
        currentTab.classList.remove("active") ;
        currentTab = newTab
        currentTab.classList.add("active") ;
    

     // Check which TAb is Selected - search / your

        // If Search Form not contains active class then add  [Search Weather]
 
        if(!searchForm.classList.contains("active")) {
            searchForm.classList.add("active") ;
            userInfoContainer.classList.remove("active") ;
            grantAccessContainer.classList.remove("active") ;
        }
        
        else {
              searchForm.classList.remove("active") ;
        
             userInfoContainer.classList.remove("active") ;
        
            getFromSessionStorage() ;
            }
        }

}

userTab.addEventListener('click' ,() => {
    switchTab(userTab);
});

searchTab.addEventListener('click' ,() => {
    switchTab(searchTab) ;
});


function getFromSessionStorage() {

    const  localcoordinates = sessionStorage.getItem("userCoordinates") ;

    if(!localcoordinates) {
        grantAccessContainer.classList.add("active") ;
    }

    else {
        const coordinates = JSON.parse(localcoordinates) ;
        fetchWeatherInfo(coordinates) ;
    }
}


async function fetchWeatherInfo(coordinates) {
    
    const {lat , lon} = coordinates ;

    grantAccessContainer.classList.remove("active") ;

    loadingContainer.classList.add("active") ;


    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    
        const data = await response.json() ;

        if(!data.sys){
            throw data ;
        }

        loadingContainer.classList.remove("active") ;
        userInfoContainer.classList.add("active") ;
        renderWeatherInfo(data) ;
    
    
    
    }

    catch (err) {
        loadingContainer.classList.remove("active") ;
        notFound.classList.add("active") ;
        errorImage.style.display = 'none' ;
        errorText.innerText = `Error :${err?.message}` ;
        errorBtn.style.display = 'block' ;
        errorBtn.addEventListener("click" , fetchWeatherInfo) ;
    }


}

// Rendor Weather

function renderWeatherInfo(weatherInfo) {

   const cityName = document.querySelector('[data-cityName]');
    const countryFlag = document.querySelector('[data-countryFlag]');
    const description = document.querySelector('[data-weatherDesc]');
    const weatherIcon = document.querySelector('[data-weatherIcon]');
    const temp = document.querySelector('[data-temp]');
    const windspeed = document.querySelector('[data-windspeed]');
    const humidity = document.querySelector('[data-humidity]');
    const clouds = document.querySelector('[data-clouds]');


    cityName.innerText = weatherInfo?.name;
    countryFlag.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    description.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp.toFixed(2)} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed.toFixed(2)} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity.toFixed(2)} %`;
    clouds.innerText = `${weatherInfo?.clouds?.all.toFixed(2)} %`;

}

const grantAccessButton = document.querySelector('[data-grantAccess]');

function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition) ;

    }

    else {
        grantAccessButton.style.display = 'none' ;
    }
}

function showPosition(pos) {
  const coords = { lat: pos.coords.latitude, lon: pos.coords.longitude };
  sessionStorage.setItem("userCoordinates", JSON.stringify(coords));

  lastRequest = { type: "coords", value: coords };
  fetchWeatherInfo(coords);
}


grantAccessButton.addEventListener('click' , getLocation) ;

const searchInput = document.querySelector("[data-searchInput]") ;

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const city = searchInput.value.trim();
  if (!city) return;             // do nothing if the field is blank

  lastRequest = { type: "city", value: city };
  fetchSearchWeatherInfo(city);
  searchInput.value = "";
});


async function fetchSearchWeatherInfo(city) {
    loadingContainer.classList.add("active") ;
    userInfoContainer.classList.remove("active") ;
    grantAccessContainer.classList.remove("active") ;
     notFound.classList.remove("active");

     try {
         const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);

        const data = await response.json();
        if (!data.sys) {
            throw data;
        }

         loadingContainer.classList.remove('active');
        userInfoContainer.classList.add('active');
        renderWeatherInfo(data);

     }

     catch (err) {
         loadingContainer.classList.remove('active');
        userInfoContainer.classList.remove('active');
        notFound.classList.add('active');
        errorText.innerText = `${err?.message}`;
        errorBtn.style.display = "none";
     }
}