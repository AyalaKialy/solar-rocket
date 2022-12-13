import { useEffect, useState } from "react";
import { AppLayout } from "../layouts/AppLayout";
import WeatherDay from "../components/DayWeather";
import { ForecastCurrent, WeatherForecast, ForecastLocation, ForecastDay } from "../graphql/schema";
import { Container, Card, CardContent, CardHeader, CardMedia, Typography } from "@mui/material";
import moment from 'moment';

const Weather = (): JSX.Element => {
  const key = process.env.REACT_APP_WHEATHER_API_KEY;
  const [lat, setLat] = useState<number>();
  const [long, setLong] = useState<number>();
  const [data, setData] = useState<WeatherForecast | null>(null);
  const currentRes: ForecastCurrent | undefined = data?.current;
  const locationRes: ForecastLocation | undefined = data?.location;
  const forecastRes: ForecastDay[] | undefined = data?.forecast?.forecastday;

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
      setLat(position.coords.latitude);
      setLong(position.coords.longitude);
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${key}&q=${lat},${long}&days=5`)
        .then(res => res.json())
        .then(data => {
          if (!data.error) {
            setData(data);
          }
        });
    }
    if (lat && long)
      fetchData();

  }, [lat, long]);

  return (
    <AppLayout title="Weather">
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" sx={{ textAlign: "center" }}>
          Weather Forecast
        </Typography>
        {data && (
          <>
            <Card sx={{ textAlign: "center", backgroundColor: "lightskyblue", width: 900, height: 400 }}>
              <CardHeader
                title={moment(locationRes?.localtime).format('llll')}
                subheader={locationRes?.name + ', ' + locationRes?.country}
              />
              <CardMedia
                component="img"
                sx={{ marginLeft: 100, margin: 0, width: 80, height: 80 }}
                image={currentRes?.condition.icon}
                alt={currentRes?.condition.text} />
              <Typography variant="h6" noWrap>{currentRes?.temp_c} &deg;C {currentRes?.condition.text}</Typography>

              <CardContent sx={{ display: 'flex', justifyContent: "space-around", margin: "40px auto", marginTop: 0, width: 800 }}>
                {forecastRes &&
                  forecastRes.map((day, index) => {
                    return (
                      <WeatherDay key={index}
                        day={day} />
                    );
                  })
                }
              </CardContent>

            </Card>
          </>
        )}
      </Container>
    </AppLayout >
  );
};

export { Weather };
