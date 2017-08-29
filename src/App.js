import React, { Component } from 'react';
import './App.css';

const WUNDERGROUND_KEY = "b56f2c0800fdf6e4";

const SUPPORTED_LANGUAGES = [
        "EN"
];

function getTemp (text) {
    return (text.match(/(\-?[0-9]+)/) || [])[1];
}


class App extends Component {

  constructor (props) {
      super(props);
      this.state = {};

      var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
      };

      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(pos => {
              this.setState({
                  coordinates: pos.coords
              });
              this.check();
          }, () => {
              this.check();
          }, options);
      }

      this.check();

      setInterval(() => this.check(), 10 * 60 * 1000);
  }

  check () {
      fetch("https://ipinfo.io/json")
        .then(res => res.json())
        .then(ip => {
            let lang = ip.country;
            if (!SUPPORTED_LANGUAGES.includes(lang)) {
                lang = "EN";
            }
            let crd = this.state.coordinates;
            crd = crd || {
                latitude: +ip.loc.split(",")[0]
              , longitude: +ip.loc.split(",")[1]
            }
            const query = [crd.latitude, crd.longitude].join(",");
            const WUNDERGROUND_URL = `https://api.wunderground.com/api/${WUNDERGROUND_KEY}/conditions/lang:${lang}/q/${query}.json`;
            return fetch(WUNDERGROUND_URL)
        })
        .then(c => c.json())
        .then(conditions => {
            this.setState({
                conditions
            });
        });
}

renderWeatherToday () {
      const today = this.state.conditions.current_observation;
      const temp = getTemp(today.temp_f);


      if (temp) {
          var tempElm = <div className="big-temp">{temp}</div>;
      }

      return (
          <div className="weather-today">
            <div className="icon-wrapper">
                
                {tempElm}
            </div>
            
          </div>
      );
}

 renderWeather () {
      if (!this.state.conditions) {
          return (
            <div className="weather-container">
                <p>Loading...</p>
            </div>
          );
      }
      return (
        <div className="weather-container">
            {this.renderWeatherToday()}
        </div>
      );
  }

  render() {
    return (
        
            <div className="app">
                {this.renderWeather()}
            </div>
       
    );
  }
}

export default App;