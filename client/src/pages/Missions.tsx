import { SyntheticEvent, useEffect, useState } from "react";
import { AppLayout } from "../layouts/AppLayout";
import { fetchGraphQL } from "../graphql/GraphQL";
import { Mission } from "../graphql/schema";
import {
  Card,
  CardHeader,
  CardActions,
  CardContent,
  Button,
  Grid,
  Typography,
  Toolbar,
  Container,
  IconButton,
  Snackbar,
  Alert,
  Box,
  CircularProgress,
} from "@mui/material";
import {
  FilterAlt as FilterAltIcon,
  Sort as SortIcon,
  ArrowDownward as ArrowDownwardIcon,
  ArrowUpward as ArrowUpwardIcon,
} from "@mui/icons-material";
import { ListMenu } from "../components/ListMenu";
import { NewMission } from "../components/NewMission";
import { EditMission } from "../components/EditMission";

type SortField = "Title" | "Date" | "Operator";

interface MissionsResponse {
  data: {
    Missions: Mission[];
  };
};

interface DeleteResponse {
  data: {
    deleteMission: Mission[];
  };
};
const getMissions = async (
  sortField: SortField,
  sortDesc: Boolean
): Promise<MissionsResponse> => {
  return await fetchGraphQL(
    `
  {
    Missions(
      sort: {
        field: ${sortField}
        desc:${sortDesc}
      }
    ) {
      id
      title
      operator
      launch {
        date
      }
    }
  }
  `,
    []
  );
};
const deleteMissionById = async (
  id: String
): Promise<MissionsResponse> => {
  return await fetchGraphQL(
    `mutation ($id: ID!){
			deleteMission(id: $id)
			{
				id
				title
				operator
				launch {
				date
				}
			}
		}
		`,
    { id: id }
  );
};

const editMissionById = async (
  id: String
): Promise<MissionsResponse> => {
  return await fetchGraphQL(
    `mutation ($id: ID!){
			editMission(id: $id)
			{
				id
				title
				operator
				launch {
				date
				}
			}
		}
		`,
    { id: id }
  );
};


const Missions = (): JSX.Element => {
  const [missions, setMissions] = useState<Mission[] | null>(null);
  const [sortDesc, setSortDesc] = useState<boolean>(false);
  const [sortField, setSortField] = useState<SortField>("Title");
  const [errMessage, setErrMessage] = useState<String | null>(null);

  const handleErrClose = (event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") return;
    setErrMessage(null);
  };

  const handleSortFieldChange = (event: SyntheticEvent, value: SortField) => {
    setSortField(value);
  };

  const handleSortDescClick = () => {
    setSortDesc(!sortDesc);
  };

  const deleteMission = (id: String) => {
    deleteMissionById(id)
      .then((result: any) => {
        setMissions(result.data.deleteMission);
      })
      .catch((err) => {
        setErrMessage("Failed to delete missions.");
        console.log(err);
      });
  };


  useEffect(() => {
    getMissions(sortField, sortDesc)
      .then((result: MissionsResponse) => {
        setMissions(result.data.Missions);
      })
      .catch((err) => {
        setErrMessage("Failed to load missions.");
        console.log(err);
      });
  }, [sortField, sortDesc]);

  return (
    <AppLayout title="Missions">
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1">
          Solar Rocket Missions
        </Typography>

        <Toolbar disableGutters>
          <Grid justifyContent="flex-end" container>
            <IconButton>
              <FilterAltIcon />
            </IconButton>
            <ListMenu
              options={["Date", "Title", "Operator"]}
              endIcon={<SortIcon />}
              onSelectionChange={handleSortFieldChange}
            />
            <IconButton onClick={handleSortDescClick}>
              {sortDesc ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
            </IconButton>
          </Grid>
        </Toolbar>

        {missions ? (
          <Grid container spacing={2}>
            {" "}
            {missions.map((mission: Mission, key: number) => (
              <Grid item key={key}>
                <Card sx={{ width: 275, height: 200 }}>
                  <CardHeader
                    title={mission.title}
                    subheader={new Date(mission.launch.date).toDateString()}
                  />
                  <CardContent>
                    <Typography noWrap>{mission.operator}</Typography>
                  </CardContent>
                  <CardActions>
                    <EditMission setMissions={setMissions} setErrMessage={setErrMessage} id={mission.id!} />
                    <Button onClick={() => deleteMission(mission.id!)}>Delete</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
            }
          </Grid>
        ) : (
          <Box sx={{ textAlign: "center" }}>
            <CircularProgress />
          </Box>
        )}
        <NewMission missions={missions} setMissions={setMissions} setErrMessage={setErrMessage} />
      </Container>
      <Snackbar
        open={errMessage != null}
        autoHideDuration={5000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        onClose={handleErrClose}
      >
        <Alert onClose={handleErrClose} variant="filled" severity="error">
          {errMessage}
        </Alert>
      </Snackbar>
    </AppLayout>
    // <New />

  );
};

export { Missions };
