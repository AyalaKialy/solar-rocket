import { useState } from "react";
import { Mission } from "../graphql/schema";
import {
    Button,
    Grid,
    Dialog,
    DialogTitle,
    TextField,
    DialogContent,
    DialogActions,
    Tooltip,
} from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { fetchGraphQL } from "../graphql/GraphQL";

interface MissionResponse {
    data: {
        Mission: Mission;
    };
}
interface MissionsResponse {
    data: {
        editMission: Mission;
    };
}

const editMission = async (
    id: String,
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
        `mutation ($id: ID!, $title: String!, $operator: String!, $date: DateTime!, $vehicle: String!, $name: String!, $longitude: Float!, $latitude: Float!, $periapsis: Int!, $apoapsis: Int!, $inclination: Int!, $capacity: Int!, $available: Int!){
			editMission(
                id: $id,
                mission: {
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
        { id: id, title: title, operator: operator, date: date, vehicle: vehicle, name: name, longitude: longitude, latitude: latitude, periapsis: periapsis, apoapsis: apoapsis, inclination: inclination, capacity: capacity, available: available }
    );
};

const getMissionById = async (
    id: String
): Promise<MissionResponse> => {
    return await fetchGraphQL(
        `query ($id: ID!){
              Mission(id: $id)
              {
                  id
                  title
                  operator
                  launch {
                  date
                  vehicle
                  location {
                    name
                    longitude
                    latitude
                  }
                  }
                  orbit {
                          periapsis
                           apoapsis
                          inclination
                        }
                         payload {
                           capacity
                          available
                        }
  
              }
          }
          `,
        { id: id }
    );
};

type Props = {
    id: String,
    setMissions: any,
    setErrMessage: any
};

const EditMission: React.FC<Props> = ({ setMissions, setErrMessage, id }) => {
    const [newMissionOpen, setNewMissionOpen] = useState<boolean>(false);
    const [mission, setMission] = useState<Mission | null>(null);
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
        getMissionById(id)
            .then((m) => {
                setMission(m.data.Mission);
                setTitle(m.data.Mission.title);
                setOperator(m.data.Mission.operator);
                setVehicle(m.data.Mission.launch.vehicle);
                setName(m.data.Mission.launch.location.name);
                setLongitude(m.data.Mission.launch.location.longitude);
                setLatitude(m.data.Mission.launch.location.latitude);
                setPeriapsis(m.data.Mission.orbit.periapsis);
                setInclination(m.data.Mission.orbit.inclination);
                setCapacity(m.data.Mission.payload.capacity);
                setAvailable(m.data.Mission.payload.available);
                setTempLaunchDate(m.data.Mission.launch.date);
            })
        setNewMissionOpen(true);
    };
    const handleNewMissionClose = () => {
        editMission(mission?.id!, title, operator, tempLaunchDate!, vehicle, name, longitude, latitude, periapsis, apoapsis, inclination, capacity, available)
            .then((result: MissionsResponse) => {
                setMissions(result.data.editMission);
            })
            .catch((err) => {
                setErrMessage("Failed to edit mission.");
                console.log(err);
            });

        setNewMissionOpen(false);
    };

    const handleTempLaunchDateChange = (newValue: Date | null) => {
        setTempLaunchDate(newValue);
    };

    return (
        <>
            <Tooltip title="Edit Mission">
                <Button
                    onClick={handleNewMissionOpen}>
                    Edit
                </Button>
            </Tooltip>
            {mission &&
                <Dialog
                    open={newMissionOpen}
                    onClose={handleNewMissionClose}
                    fullWidth
                    maxWidth="sm"
                >
                    <DialogTitle>Edit Mission</DialogTitle>
                    <DialogContent>
                        <Grid container direction="column" spacing={2}>
                            <Grid item>
                                <TextField
                                    autoFocus
                                    id="tile"
                                    label="Title"
                                    variant="standard"
                                    fullWidth
                                    value={title}
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
                                    value={operator}
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
                                    value={vehicle}
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
                                    value={name}
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
                                    value={longitude}
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
                                    value={latitude}
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
                                    value={periapsis}
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
                                    value={apoapsis}
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
                                    value={inclination}
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
                                    value={capacity}
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
                                    value={available}
                                    onInput={e => setAvailable(Number((e.target as HTMLTextAreaElement).value))}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleNewMissionClose}>Cancel</Button>
                        <Button onClick={handleNewMissionClose}>Save</Button>
                    </DialogActions>
                </Dialog>}
        </>
    );
};

export { EditMission };

