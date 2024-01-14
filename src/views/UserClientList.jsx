import Grid from "@mui/system/Unstable_Grid/Grid";
import Axios from "axios";
import { useState, useEffect } from "react";
import {
  Button,
  CircularProgress,
  // Card,
  // Divider,
  // List,
  // ListItem,
  // ListItemIcon,
  // ListItemText,
} from "@mui/material";
import {
  AddRounded,
  // DraftsRounded,
  // Person,
  // Description,
} from "@mui/icons-material";
import { ClientCard } from "../components/ClientCard";
import { useNavigate } from "react-router-dom";

export const UserClientList = ({ email, token, onLogIn }) => {
  const navigation = useNavigate();
  const [profileInfo, setProfileInfo] = useState(null);
  const [userClients, setUserClients] = useState(null);

  const onAddNewClient = () => {
    navigation("/assignClient", { replace: true });
  };

  useEffect(() => {
    Axios.get(`//localhost:3500/search/email=${email}`)
      .then((res) => {
        setProfileInfo(res.data);
      })
      .catch(() => {
        console.log("Something went wrong while fetching profile info.");
      });
  }, [email]);

  useEffect(() => {
    Axios.get(`//localhost:3500/users/getClients/email=${email}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setUserClients(res.data.clients);
      })
      .catch(() => {
        console.log("something went wrong when fetching user clients");
      });
  }, [email, token]);

  useEffect(() => {
    if (profileInfo) {
      onLogIn(profileInfo);
    }
  }, [onLogIn, profileInfo]);

  if (!profileInfo) {
    return;
  }
  return (
    <div>
      <Grid container spacing={3} margin={"10px"}>
        {userClients ? (
          userClients.map((client, i) => {
            return (
              <Grid xs={6} key={i}>
                <ClientCard client={client} navigation={navigation} />
              </Grid>
            );
          })
        ) : (
          <Grid xs={12}>
            <h2>Fetching client data...</h2>
            <CircularProgress color="success" />
          </Grid>
        )}
        <Grid xs={6}>
          <Button
            color="success"
            variant="contained"
            style={{
              margin: "10px",
              height: "100px",
              width: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={onAddNewClient}
          >
            <AddRounded
              style={{
                fontSize: "10cqh",
                color: "white",
              }}
            />
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};
