'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function WeatherSearch() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY;

  const fetchWeather = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Check local storage for cached data
    const cachedData = localStorage.getItem(city);
    if (cachedData) {
      setWeather(JSON.parse(cachedData));
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error('City not found');
      }

      const data = await response.json();
      setWeather(data);
      // Cache the data in local storage
      localStorage.setItem(city, JSON.stringify(data));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <form onSubmit={fetchWeather} className="mb-4">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
          className="w-full px-3 py-2 border rounded text-foreground bg-background"
          required
        />
        <button
          type="submit"
          className="w-full mt-2 bg-foreground text-background py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Get Weather'}
        </button>
      </form>

      {error && <p className="text-red-500">{error}</p>}

      {weather && (
        <div className="bg-gray-200 text-background p-4 rounded">
          <h2 className="text-2xl font-bold">{weather.name}</h2>
          <p className="text-xl">{weather.main.temp}°C</p>
          <p>{weather.weather[0].description}</p>
          <p>Humidity: {weather.main.humidity}%</p>
          <p>Wind Speed: {weather.wind.speed} m/s</p>
          {/* Display weather icon */}
          <img
            src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
            className="mx-auto"
          />
        </div>
      )}
    </div>
  );
}
