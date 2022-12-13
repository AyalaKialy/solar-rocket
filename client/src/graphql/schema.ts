export type Mission = {
  id: String;
  title: String;
  operator: String;
  launch: Launch;
  orbit: Orbit;
  payload: Payload;
}

export type Launch = {
  date: Date;
  vehicle: String;
  location: Location;
}

export type Location = {
  name: String;
  longitude: Number;
  latitude: Number;
}

export type Orbit = {
  periapsis: Number;
  apoapsis: Number;
  inclination: Number;
}

export type Payload = {
  capacity: Number;
  available: Number;
}

export type WeatherForecast = {
  location: ForecastLocation;
  current: ForecastCurrent;
  forecast: { forecastday: ForecastDay[] };
}

export type ForecastLocation = {
  localtime: string;
  country: string;
  name: string;
}

export type ForecastCurrent = {
  name: string;
  temp_c: string;
  condition: ForecastCurrentCondition;
}

export type ForecastCurrentCondition = {
  icon: string;
  text: string;
}

export type ForecastDay = {
  date: string;
  day: {
    avgtemp_c: string;
    condition: ForecastCurrentCondition;
  }
}
