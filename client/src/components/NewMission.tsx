import { useState } from "react";
import { Mission } from "../graphql/schema";
import {
  Button,
  Grid,
  Fab,
  Dialog,
  DialogTitle,
  TextField,
  DialogContent,
  DialogActions,
  Tooltip,
} from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { Add as AddIcon } from "@mui/icons-material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { fetchGraphQL } from "../graphql/GraphQL";

interface MissionsResponse {
  data: {
    createMission: Mission;
  };
}

const createMission = async (
  title: String,
  operator: String,
  date: Date,
  vehicle: String,
  name: String,
  longitude: Number,
  latitude: Number,
  periapsis: Number,
  apoapsis: Number,
  inclination: Number,
  capacity: Number,
  available: Number
): Promise<MissionsResponse> => {
  return await fetchGraphQL(
    `mutation ($title: String!, $operator: String!, $date: DateTime!, $vehicle: String!, $name: String!, $longitude: Float!, $latitude: Float!, $periapsis: Int!, $apoapsis: Int!, $inclination: Int!, $capacity: Int!, $available: Int!){
			createMission(mission: {
				title: $title,
				operator: $operator,
				launch:{
				date: $date,
				vehicle: $vehicle,
				location: {
					name: $name,
					longitude: $longitude,
					latitude: $latitude,
				},				
				},
				orbit:{
				periapsis: $periapsis,
				apoapsis: $apoapsis,
				inclination: $inclination,
				},
				payload:{
				capacity: $capacity,
				available: $available
				}
			}){
				id
				title
				operator
				launch {
				date
				}
			}
		}
		`,
    { title: title, operator: operator, date: date?.toISOString(), vehicle: vehicle, name: name, longitude: longitude, latitude: latitude, periapsis: periapsis, apoapsis: apoapsis, inclination: inclination, capacity: capacity, available: available }
  );
};

type Props = {
  missions: Mission[] | null,
  setMissions: any,
  setErrMessage: any
};

const NewMission: React.FC<Props> = ({ missions, setMissions, setErrMessage }) => {
  const [newMissionOpen, setNewMissionOpen] = useState<boolean>(false);
  const [tempLaunchDate, setTempLaunchDate] = useState<Date | null>(null);
  const [title, setTitle] = useState<String>("");
  const [operator, setOperator] = useState<String>("");
  const [vehicle, setVehicle] = useState<String>("");
  const [name, setName] = useState<String>("");
  const [longitude, setLongitude] = useState<Number>(0);
  const [latitude, setLatitude] = useState<Number>(0);
  const [periapsis, setPeriapsis] = useState<Number>(0);
  const [apoapsis, setApoapsis] = useState<Number>(0);
  const [inclination, setInclination] = useState<Number>(0);
  const [capacity, setCapacity] = useState<Number>(0);
  const [available, setAvailable] = useState<Number>(0);

  const handleNewMissionOpen = () => {
    setTempLaunchDate(null);
    setNewMissionOpen(true);
  };
  const handleNewMissionClose = () => {
    if (title && operator && tempLaunchDate && vehicle && name && longitude && latitude && periapsis && apoapsis && inclination && capacity && available) {
      createMission(title, operator, tempLaunchDate, vehicle, name, longitude, latitude, periapsis, apoapsis, inclination, capacity, available)
        .then((result: MissionsResponse) => {
          setMissions([...missions!, result.data.createMission]);
        })
        .catch((err) => {
          setErrMessage("Failed to load missions.");
          console.log(err);
        });
    }
    setNewMissionOpen(false);
  };

  const handleTempLaunchDateChange = (newValue: Date | null) => {
    setTempLaunchDate(newValue);
  };

  return (
    <>
      <Tooltip title="New Mission">
        <Fab
          sx={{ position: "fixed", bottom: 16, right: 16 }}
          color="primary"
          aria-label="add"
          onClick={handleNewMissionOpen}
        >
          <AddIcon />
        </Fab>
      </Tooltip>
      <Dialog
        open={newMissionOpen}
        onClose={handleNewMissionClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>New Mission</DialogTitle>
        <DialogContent>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <TextField
                autoFocus
                id="tile"
                label="Title"
                variant="standard"
                fullWidth
                onInput={e => setTitle((e.target as HTMLTextAreaElement).value)}
              />
            </Grid>
            <Grid item>
              <TextField
                autoFocus
                id="operator"
                label="Operator"
                variant="standard"
                fullWidth
                onInput={e => setOperator((e.target as HTMLTextAreaElement).value)}
              />
            </Grid>
            <Grid item>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  minDate={new Date()}
                  minTime={new Date()}
                  label="Launch Date"
                  value={tempLaunchDate}
                  onChange={handleTempLaunchDateChange}
                  renderInput={(params) => (
                    <TextField variant="standard" {...params} />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item>
              <TextField
                autoFocus
                id="vehicle"
                label="Vehicle"
                variant="standard"
                fullWidth
                onInput={e => setVehicle((e.target as HTMLTextAreaElement).value)}
              />
            </Grid>
            <Grid item>
              <TextField
                autoFocus
                id="name"
                label="Name"
                variant="standard"
                fullWidth
                onInput={e => setName((e.target as HTMLTextAreaElement).value)}
              />
            </Grid>
            <Grid item>
              <TextField
                autoFocus
                id="longitude"
                label="Longitude"
                variant="standard"
                fullWidth
                onInput={e => setLongitude(Number((e.target as HTMLTextAreaElement).value))}
              />
            </Grid>
            <Grid item>
              <TextField
                autoFocus
                id="latitude"
                label="Latitude"
                variant="standard"
                fullWidth
                onInput={e => setLatitude(Number((e.target as HTMLTextAreaElement).value))}
              />
            </Grid>
            <Grid item>
              <TextField
                autoFocus
                id="periapsis"
                label="Periapsis"
                variant="standard"
                fullWidth
                onInput={e => setPeriapsis(Number((e.target as HTMLTextAreaElement).value))}
              />
            </Grid>
            <Grid item>
              <TextField
                autoFocus
                id="apoapsis"
                label="Apoapsis"
                variant="standard"
                fullWidth
                onInput={e => setApoapsis(Number((e.target as HTMLTextAreaElement).value))}
              />
            </Grid>
            <Grid item>
              <TextField
                autoFocus
                id="inclination"
                label="Inclination"
                variant="standard"
                fullWidth
                onInput={e => setInclination(Number((e.target as HTMLTextAreaElement).value))}
              />
            </Grid>
            <Grid item>
              <TextField
                autoFocus
                id="capacity"
                label="Capacity"
                variant="standard"
                fullWidth
                onInput={e => setCapacity(Number((e.target as HTMLTextAreaElement).value))}
              />
            </Grid>
            <Grid item>
              <TextField
                autoFocus
                id="available"
                label="Available"
                variant="standard"
                fullWidth
                onInput={e => setAvailable(Number((e.target as HTMLTextAreaElement).value))}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNewMissionClose}>Cancel</Button>
          <Button onClick={handleNewMissionClose}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export { NewMission };

