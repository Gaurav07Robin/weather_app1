import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import CitiesTable from './CitiesTable';
import WeatherTable from './weatherTable';
import SelfWeather from './SelfWeather';


function App() {
  
  const favCity = "New York";
  const isFavourite = false;

  return (
    <div >
    <Router>
     <Routes>
        <Route path="/" element={<CitiesTable favCity= {favCity} isFavourite = {isFavourite}/>} />
       
        <Route path="/weather/:cityName" element={<WeatherTable/>} />
        <Route path="/weather/:lati/:longi" element={<SelfWeather/>} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
