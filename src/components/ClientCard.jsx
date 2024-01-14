import Grid from "@mui/system/Unstable_Grid/Grid";
import { useState } from "react";
import Axios from "axios";
import {
  Button,
  Card,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  CardMedia,
} from "@mui/material";
import {
  DraftsRounded,
  Person,
  Description,
  Edit,
  EditOff,
  Save,
} from "@mui/icons-material";

export const ClientCard = ({
  client,
  navigation,
  showDetailsButton = true,
}) => {
  const [showNotes, setShowNotes] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentNotes, setCurrentNotes] = useState(client.notes ?? "");

  const changeHideNotes = () => {
    setShowNotes(!showNotes);
  };

  const changeEditMode = () => {
    setEditMode(!editMode);
    setCurrentNotes(client.notes ?? "");
  };

  const saveNotesChanges = () => {
    const loggedInEmail = localStorage.getItem("email");
    const loggedInToken = localStorage.getItem("token");
    const clientEmail = client.email;

    if (!loggedInEmail || !loggedInToken || !clientEmail) {
      console.log("Error when preparing update notes request");
    }

    Axios.patch(
      `//localhost:3500/users/updateNotes/userEmail=${loggedInEmail}&clientEmail=${clientEmail}`,
      {
        notes: currentNotes,
      },
      {
        headers: { Authorization: `Bearer ${loggedInToken}` },
      }
    )
      .then((res) => {
        const responseMessage = res.data.message;
        console.log(responseMessage);
        setEditMode(false);
        setShowNotes(true);
        setCurrentNotes(currentNotes);
      })
      .catch((res) => {
        console.log(res);
      });
  };

  const openEmail = () => {
    window.location.href = `mailto:${client.email}?subject=Email%20Title&body=Dear%20${client.name}%20${client.surname},`;
  };

  const openDetails = () => {
    navigation(`/clientDetails/${client._id}`, { replace: true });
  };

  return (
    <Card
      raised
      style={{
        // height: "100%",
        display: "flex",
        alignItems: "center",
        // justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <CardMedia
        component="img"
        image={
          client.photo
            ? `${client.photo}`
            : "https://emedia1.nhs.wales/HEIW2/cache/file/F4C33EF0-69EE-4445-94018B01ADCF6FD4.png"
        }
        alt={`${client.name} ${client.surname}`}
        sx={{
          aspectRatio: 1,
          maxHeight: "200px",
          minHeight: "200px",
          objectFit: "contain",
        }}
      />
      <List style={{ width: "80%" }}>
        <ListItem disablePadding>
          <ListItemIcon>
            <DraftsRounded />
          </ListItemIcon>
          <ListItemText primary={client.email} />
        </ListItem>
        <Divider />
        <ListItem disablePadding>
          <ListItemIcon>
            <Person />
          </ListItemIcon>
          <ListItemText primary={client.surname + ", " + client.name} />
        </ListItem>
        <Divider />
        <ListItem disablePadding>
          <Button onClick={changeHideNotes} fullWidth>
            <Description />
            {showNotes ? "Hide Notes" : "Show Notes"}
          </Button>
        </ListItem>
        {showNotes ? (
          <>
            <ListItem disablePadding>
              <Button onClick={changeEditMode} fullWidth>
                {editMode ? <EditOff /> : <Edit />}
                {editMode ? "Cancel editing" : "Start editing"}
              </Button>
            </ListItem>
            {editMode ? (
              <ListItem>
                <Button fullWidth onClick={saveNotesChanges}>
                  <Save />
                  Save changes
                </Button>
              </ListItem>
            ) : null}
            <ListItem disablePadding>
              {editMode ? (
                <TextField
                  multiline
                  fullWidth
                  minRows={3}
                  maxRows={Infinity}
                  label={"Client notes"}
                  type="text"
                  value={currentNotes}
                  onChange={(e) => setCurrentNotes(e.target.value)}
                />
              ) : (
                <ListItemText
                  style={{
                    whiteSpace: "pre-wrap",
                  }}
                  primary={currentNotes}
                />
              )}
            </ListItem>
          </>
        ) : null}
      </List>
      <Grid
        container
        spacing={1}
        marginBottom={"5px"}
        style={{ width: "100%" }}
      >
        {showDetailsButton ? (
          <Grid xs={6}>
            <Button variant="contained" onClick={openDetails}>
              Diet Plan
            </Button>
          </Grid>
        ) : null}
        <Grid xs={showDetailsButton ? 6 : 12}>
          <Button variant="contained" onClick={openEmail}>
            Message
          </Button>
        </Grid>
      </Grid>
    </Card>
  );
};
