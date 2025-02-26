import dotenv from 'dotenv';
import dayjs from 'dayjs';
dotenv.config();

// -done TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: string;
  lon: string;
}

// -done TODO: Define a class for the Weather object
class Weather {
  city: string;
  date: string;
  icon: string;
  iconDescription: string;
  tempF: string;
  windSpeed: string;
  humidity: string;

  constructor(
    city: string,
    date: string,
    icon: string,
    iconDescription: string,
    tempF: string,
    windSpeed: string,
    humidity: string
  ) {
    this.city = city;
    this.date = date;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
  }
}

// -done TODO: Complete the WeatherService class
class WeatherService {
  // -done TODO: Define the baseURL, API key, and city name properties
  private baseURL: string | undefined;
  private apiKey: string;
  cityName: string;

  constructor() {
    this.baseURL = process.env.API_BASE_URL;
    this.apiKey = process.env.API_KEY || '';
    this.cityName = '';
  }

  // TODO: Create fetchLocationData method
  private async fetchLocationData() {
    return await fetch(this.baseURL + this.buildGeocodeQuery());
  }

  // TODO: Create destructureLocationData method
  // private destructureLocationData(locationData: Coordinates): Coordinates {}

  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    const limit = 1; // You can adjust the limit as needed
    return `/geo/1.0/direct?q=${this.cityName}&limit=${limit}&appid=${this.apiKey}`;
  }
  // TODO: Create buildWeatherQuery method
  // private buildWeatherQuery(coordinates: Coordinates): string {}
   
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    const response = await this.fetchLocationData();
    const locationData = await response.json();
    const coordinates: Coordinates = {
      lat: locationData[0].lat,
      lon: locationData[0].lon
    }
    return coordinates;
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {

    const response = await fetch(this.baseURL + `/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`);
    // console.log('response here - - - - -', this.baseURL + `/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`);
    return response.json();
  }

  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any): Weather[] {
    // const weatherData = new Weather(
    //   response.city.name,
    //   response.list[0].dt_txt,
    //   response.list[0].weather[0].icon,
    //   response.list[0].weather[0].description,
    //   response.list[0].main.temp,
    //   response.list[0].wind.speed,
    //   response.list[0].main.humidity
    // );

    const forecatArr = [];
    for (let i = 0; i < response.list.length; i = i + 8) {
      forecatArr.push(new Weather(
        response.city.name,
        dayjs(response.list[i].dt_txt).format('MM/DD/YYYY'),
        response.list[i].weather[0].icon,
        response.list[i].weather[0].description,
        response.list[i].main.temp,
        response.list[i].wind.speed,
        response.list[i].main.humidity
      ));
    }
    forecatArr.push(new Weather(
      response.city.name,
      dayjs(response.list[39].dt_txt).format('MM/DD/YYYY'),
      response.list[39].weather[0].icon,
      response.list[39].weather[0].description,
      response.list[39].main.temp,
      response.list[39].wind.speed,
      response.list[39].main.humidity
    ));

    return forecatArr;
  }

  // TODO: Complete buildForecastArray method
  // private buildForecastArray(currentWeather: Weather, weatherData: any[]) {

  //   return [currentWeather, forecastArr];
  // }

  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    const weatherData = await this.fetchWeatherData(coordinates);
    const parsedWeatherData = this.parseCurrentWeather(weatherData);
    return parsedWeatherData;
  }
}

export default new WeatherService();
