import { Box, CardMedia, Typography } from "@mui/material";
import { ForecastDay } from "../graphql/schema";
import moment from 'moment';


type Props = {
    day: ForecastDay
};
const WeatherDay: React.FC<Props> = ({ day }) => {

    return (
        <>
            <Box sx={{ width: 130, backgroundColor: "white", borderRadius: 5, display: "flex", flexDirection: "column", textAlign: "center", padding: "10px" }}>
                <p>{moment(day.date).format("ddd DD/MM")}</p>
                <CardMedia
                    component="img"
                    sx={{ width: 50, margin: "0 auto" }}
                    image={day.day.condition.icon}
                    alt={day.day.condition.text} />
                <Typography variant="h4">
                    {day.day.avgtemp_c} &deg;
                </Typography>
            </Box>
        </>
    )
}

export default WeatherDay;