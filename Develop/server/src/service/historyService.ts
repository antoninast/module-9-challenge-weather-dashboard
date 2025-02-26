import fs from 'node:fs/promises';
import { v1 as uuidv1 } from 'uuid';

// -done TODO: Define a City class with name and id properties
class City {
  
  id: string;
  name: string;

  constructor(
    name: string
  ) {
    this.id = uuidv1();
    this.name = name;
  }
}

// -done TODO: Complete the HistoryService class
class HistoryService {
  // -done TODO: Define a read method that reads from the searchHistory.json file
  private async read() {
    return await fs.readFile('db/searchHistory.json', {
      flag: 'a+',
      encoding: 'utf8',
    });
  }

  // -done TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {
    return await fs.writeFile(
      'db/searchHistory.json',
      JSON.stringify(cities, null, '\t')
    );
  }

  // -done TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities(): Promise<City[]> {
    return await this.read().then((cities) => {
      let parsedCities: City[];

      try {
        parsedCities = [].concat(JSON.parse(cities))
      } catch(err) {
        parsedCities = [];
      }

      return parsedCities;
    })
  }

  // -done TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string): Promise<City | string> {
    if (!city) {
      throw new Error('City cannot be blank');
    }

    const cities = await this.getCities();
    const cityExists = cities.find((c) => c.name.toLowerCase() === city.toLowerCase());
    if (!cityExists) {
      const newCity = new City(city);
      cities.push(newCity);
  
      this.write(cities);
      return newCity;
    } else {
      return '';
    }
  }

  // * BONUS -done TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string) {
    if (!id) {
      throw new Error('City Id cannot be blank');
    }
    
    const cities = await this.getCities();
    const modifiedCities = cities.filter((city) => city.id !== id);
    this.write(modifiedCities);
  }
}

export default new HistoryService();
