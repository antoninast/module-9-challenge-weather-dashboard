import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// -done TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  const cityName = req.body.cityName;
  try {
    await WeatherService.getWeatherForCity(cityName)
      .then((data) => res.json(data));
    // -done TODO: save city to search history
    await HistoryService.addCity(cityName);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }

});

// -done TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  const data = await HistoryService.getCities();
  res.json(data);
});

// * BONUS -done TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = await HistoryService.removeCity(id);
  res.json(data);
});

export default router;
