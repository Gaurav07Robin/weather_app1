import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import cloudyMoon from './icons/cloudy_moon.svg';
import cloudyDay1 from './static/cloudy-day-1.svg';
import cloudyDay2 from './static/cloudy-day-2.svg';
import day1 from './static/day.svg';
import night1 from './animated/night.svg';
import rainyDay1 from './animated/rainy-1.svg';
import rainyDay2 from './animated/rainy-2.svg';
import rainyDay3 from './animated/rainy-3.svg';
import snowyDay1 from './animated/snowy-1.svg';
import snowyDay2 from './animated/snowy-2.svg';
import thunder1 from './animated/thunder.svg';



const SelfWeather = () => {
  const { lati } = useParams();
  const {longi} = useParams();
//   console.log("cityName", cityName);

  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [weatherCondition, setWeatherCondition] = useState<any>(null);
  
useEffect(() => {
    const apiUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lati}&lon=${longi}&appid=f88331b9cf1b23ec60f1961c5327d50b`;
  
          fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
              setWeatherData(data.current);
              setWeatherCondition(data.daily[0]);
console.log("data", data);
            const weatherContainer = document.querySelector('.weather-container') as HTMLElement;
            weatherContainer.style.backgroundColor = getBackgroundColor(data.daily[0].temp);
              setLoading(false);
            })
            .catch(error => {
              console.error('Error fetching weather data:', error);
              setLoading(false);
            });

  },[lati, longi, weatherData]);


  function getWeatherIconUrl(data : number) : string {
    switch (true) {
      case data >=200 && data < 300:
        return 'https://openweathermap.org/img/wn/11d@2x.png'; // Light rain icon URL
      case data >=300 && data < 400:
        return 'https://openweathermap.org/img/wn/09d@2x.png'; // Clear sky icon URL
      case data >=500 && data < 600:
        return 'https://openweathermap.org/img/wn/10d@2x.png'; // Mist icon URL
      // Add cases for other weather codes as needed
      case data >=600 && data < 700:
        return 'https://openweathermap.org/img/wn/13d@2x.png';
      case data === 800:
        return 'https://openweathermap.org/img/wn/01d@2x.png';
      case data >=700 && data < 800:
        return 'https://openweathermap.org/img/wn/50d@2x.png';
      default:
        return 'https://openweathermap.org/img/wn/02d@2x.png'; // Default icon URL
    }
  }

  if (loading) return <p>Loading...</p>;


  let weatherClass = '';

  if (weatherData) {
    const weatherConditionn = weatherData.weather[0].id; // Replace with actual weather condition property

    if(weatherConditionn < 300 && weatherConditionn >= 200 ){
      weatherClass = 'thunderstorm'
    }
    else if(weatherConditionn < 400 && weatherConditionn >= 300){
      weatherClass = 'drizzle'
    }
    else if(weatherConditionn < 500 && weatherConditionn >= 400){
      weatherClass = 'rain'
    }
    else if(weatherConditionn < 600 && weatherConditionn >= 500){
      weatherClass = 'snow'
    }
    else if(weatherConditionn < 700 && weatherConditionn >= 600){
      weatherClass = 'not-clear'
    }
    else if(weatherConditionn === 800){
      weatherClass = 'clear'
    }
    else {
      weatherClass = 'cloudy'
    }

  }

  function getBackgroundColor(temp: number): string {
    // Define temperature thresholds and corresponding colors
    const thresholds = [
        { temp: 0, color: '#4caf50' }, // Cold temperature (green)
        { temp: 20, color: '#ffc107' }, // Moderate temperature (yellow)
        { temp: 30, color: '#ff5722' } // Hot temperature (orange)
        
    ];

    // Find the color corresponding to the temperature
    for (let i = 0; i < thresholds.length; i++) {
        if (temp < thresholds[i].temp) {
            return thresholds[i].color;
        }
    }

    // Return default color if temperature exceeds all thresholds
    return '#2196f3'; // Default color (blue)
}


  return (

    <div className={`weather-model ${weatherClass}`}>
    
    <div className= 'weather-container'>
    
    <div> 
  

    </div>
        <h2>Current Location Weather</h2>
       
        {weatherData && weatherCondition && (
            <div className="weather-info">
                <img src={getWeatherIconUrl(weatherData.weather[0].id)} alt="Weather Icon" /> 
                <div className='row'>
                    <div className='col-md-6'>
                        <div className="card-1">
                            <div className='row'>
                                <p>Temperature: {weatherData.temp}°C</p>
                                <p>Humidity: {weatherData.humidity}%</p>
                                <p>Wind Speed: {weatherData.wind_speed} m/s</p>
                                <p>Pressure: {weatherData.pressure} pa</p>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-6'>
                        <div className="card-2">
                            <div className='row'>
                                <p>High: {weatherCondition.temp.max} and Lows: {weatherCondition.temp.min}</p>
                                <p>Weather Description: {weatherCondition.weather[0].description}</p>
                                <p>Rain Chance: {weatherCondition.rain}%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
</div>

  );
};

export default SelfWeather;