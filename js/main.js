
const openCage = {
    key : "f19ccc057b654ddeace8d7e6d057f123",
    base : "https://api.opencagedata.com/geocode/v1/json?"
}

const api = {
    key : "da41dce6945a4b70418b2fdfc63fe515",
    base : "https://api.openweathermap.org/data/2.5/onecall?"
}

let Days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let Months = ["January", "February", "March", "April", "May", "June", "July", "August", 
"September", "October", "November", "December"];



window.addEventListener('load', function () {

    if (document.body.id =='index'){
        var weather = JSON.parse(localStorage.getItem('weather'));
        var cityNameVar = localStorage.getItem('cityNameVar');
    
        const searchbox = document.querySelector('.city');
        searchbox.addEventListener('keypress',setQuery);
    
        if (weather){
            console.log(cityNameVar);
            let cityName = document.querySelector('.city-name span');
            cityName.innerText = `${cityNameVar}`;
            displayResults(weather);
        }
        else{
            getCoord('Agadir');
        }
    
        function setQuery(evt){
            if (evt.keyCode == 13){
                getCoord(searchbox.value);
            }   
        }
    
        function getCoord(query){
            fetch(`${openCage.base}q=${query}&language=native&key=${openCage.key}`)
            .then(geo => {
                return geo.json();
            }).then(getResults);
        }
    
        function getResults(geo){
            console.log(geo);
            fetch(`${api.base}lat=${geo.results[0].geometry.lat}&lon=${geo.results[0].geometry.lng}&exclude={part}&units=metric&appid=${api.key}`)
            .then(weather => {
                return weather.json();
            }).then(displayResults);
            
            localStorage.setItem('geo', JSON.stringify(geo));
            
            if (searchbox.value == ''){
                let cityName = document.querySelector('.city-name span');
                cityName.innerText = `Agadir, ${geo.results[0].components.country}`;
                var cityNameVar = `Agadir, ${geo.results[0].components.country}`;
            }
            else{
                let cityName = document.querySelector('.city-name span');
                cityName.innerText = `${searchbox.value.charAt(0).toUpperCase() + searchbox.value.slice(1)}, ${geo.results[0].components.country}`;
                var cityNameVar = `${searchbox.value.charAt(0).toUpperCase() + searchbox.value.slice(1)}, ${geo.results[0].components.country}`;
            }

            localStorage.setItem('cityNameVar', cityNameVar);
        }
    
    
    function displayResults(weather){
        localStorage.setItem('weather', JSON.stringify(weather));
        console.log(weather);
    
        let img = document.querySelector('.weather-img')
        img.src = `http://openweathermap.org/img/wn/${weather.current.weather[0].icon}@4x.png`
    
        let temp = document.querySelector('.temp');
        temp.innerHTML = `${Math.round(weather.current.temp)}<span>°</span>`;
    
        let description = document.querySelector('.weather');
        description.innerText = `${weather.current.weather[0].main}`;
    
        let windspeed = document.querySelector('.windspeed h1');
        windspeed.innerText = `${Math.round(weather.current.wind_speed)} km/h`;
    
        let humidity = document.querySelector('.humidity h1');
        humidity.innerText = `${Math.round(weather.current.humidity)}%`;
    
        let sunrise = document.querySelector('.sunrise h1');
        var sunriseTime = new Date((weather.current.sunrise + weather.timezone_offset -3600)* 1000);
        var minutes = "0" + sunriseTime.getMinutes();
        var formattedTime = ("0"+sunriseTime.getHours()).substr(-2) + ':' + minutes.substr(-2);
        sunrise.innerText = `${formattedTime}`;
    
        let sunset = document.querySelector('.sunset h1');
        var sunsetTime = new Date((weather.current.sunset + weather.timezone_offset -3600)* 1000);
        var minutes = "0" + sunsetTime.getMinutes();
        var formattedTime = ("0"+sunsetTime.getHours()).substr(-2) + ':' + minutes.substr(-2);
        sunset.innerText = `${formattedTime}`;
    
        for (i=0; i<25; i++){
            let itemTime = document.querySelector('.item-'+(i+1)+' .card p');
            var Time = new Date((weather.hourly[i].dt + weather.timezone_offset -3600)* 1000);
            var minutes = "0" + Time.getMinutes();
            var formattedTime = ("0" + Time.getHours()).substr(-2) + ':' + minutes.substr(-2);
            itemTime.innerText = `${formattedTime}`;
    
            let itemTemp = document.querySelector('.item-'+(i+1)+' .card h4');
            itemTemp.innerHTML = `${Math.round(weather.hourly[i].temp)}<span>°</span>`;
    
            let itemImg = document.querySelector('.item-'+(i+1)+' .card img');
            itemImg.src = `http://openweathermap.org/img/wn/${weather.hourly[i].weather[0].icon}.png`
        }
    
        var i;
    
        const list = document.querySelectorAll('.card');
        function activeLink(){
            list.forEach((item) => 
            item.classList.remove('active-card'));
            this.classList.add('active-card');
            i = Array.prototype.indexOf.call(list, this);
            updateResults(weather, i)
        }
        list.forEach((item) => item.addEventListener('click',activeLink));
    
    
        
    
    }
    
    let now = new Date();
    let date = document.querySelector('.date');
    date.innerText = dateBuilder(now);
    
    function dateBuilder(now){
        return `${Days[now.getDay()]}, ${now.getDate()} ${Months[now.getMonth()]}`;
    }
    
    
    
    function updateResults(weather, i){
        let img = document.querySelector('.weather-img')
        img.src = `http://openweathermap.org/img/wn/${weather.hourly[i].weather[0].icon}@4x.png`
    
        let temp = document.querySelector('.temp');
        temp.innerHTML = `${Math.round(weather.hourly[i].temp)}<span>°</span>`;
    
        let description = document.querySelector('.weather');
        description.innerText = `${weather.hourly[i].weather[0].main}`;
    
        let windspeed = document.querySelector('.windspeed h1');
        windspeed.innerText = `${Math.round(weather.hourly[i].wind_speed)} km/h`;
    
        let humidity = document.querySelector('.humidity h1');
        humidity.innerText = `${Math.round(weather.hourly[i].humidity)}%`;
    }
    
    
    }
    
    else if (document.body.id == 'tomorrow'){
        function updateNextDays(weather){
            let img = document.querySelector('.weather-img-tomorrow')
            img.src = `http://openweathermap.org/img/wn/${weather.daily[1].weather[0].icon}@4x.png`
        
            let MaxMin = document.querySelector('.max-min');
            MaxMin.innerHTML = `${Math.round(weather.daily[1].temp.max)}° / ${Math.round(weather.daily[1].temp.min)}°`;
        
            let descriptionTmrrw = document.querySelector('.description-tomorrow');
            descriptionTmrrw.innerText = `${weather.daily[1].weather[0].main}`;
        
            let windspeedTmrrw = document.querySelector('.windspeed-tomorrow h1');
            windspeedTmrrw.innerText = `${Math.round(weather.daily[1].wind_speed)} km/h`;
        
            let humidityTmrrw = document.querySelector('.humidity-tomorrow h1');
            humidityTmrrw.innerText = `${Math.round(weather.daily[1].humidity)}%`;
        
            let sunriseTmrrw = document.querySelector('.sunrise-tomorrow h1');
            var sunriseTmrrwTime = new Date((weather.daily[1].sunrise + weather.timezone_offset -3600)* 1000);
            var minutes = "0" + sunriseTmrrwTime.getMinutes();
            var formattedTime = ("0"+sunriseTmrrwTime.getHours()).substr(-2) + ':' + minutes.substr(-2);
            sunriseTmrrw.innerText = `${formattedTime}`;
        
            let sunsetTmrrw = document.querySelector('.sunset-tomorrow h1');
            var sunsetTmrrwTime = new Date((weather.daily[1].sunset + weather.timezone_offset -3600)* 1000);
            var minutes = "0" + sunsetTmrrwTime.getMinutes();
            var formattedTime = ("0"+sunsetTmrrwTime.getHours()).substr(-2) + ':' + minutes.substr(-2);
            sunsetTmrrw.innerText = `${formattedTime}`;
        
            for (i=1; i<8; i++){
                let itemDayTmrrw = document.querySelector('.day-item-'+i+' p');
                let Day = new Date((weather.daily[i].dt + weather.timezone_offset -3600)* 1000);
                itemDayTmrrw.innerText = `${Days[Day.getDay()].substr(0,3)}`;
        
                let itemDescriptionTmrrw = document.querySelector('.day-item-'+i+' span p');
                itemDescriptionTmrrw.innerText = `${weather.daily[i].weather[0].main}`;
        
                let itemTempTmrrw = document.querySelector('.day-item-'+i+' .day-max-min-temp p');
                itemTempTmrrw.innerText = `${Math.round(weather.daily[i].temp.max)}° / ${Math.round(weather.daily[i].temp.min)}°`;
        
                let itemImgTmrrw = document.querySelector('.day-item-'+i+' span img');
                itemImgTmrrw.src = `http://openweathermap.org/img/wn/${weather.daily[i].weather[0].icon}.png`;
            }
        }
        var weather = JSON.parse(localStorage.getItem('weather'));
        updateNextDays(weather);
    }
  })