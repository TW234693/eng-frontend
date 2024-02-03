import Grid from "@mui/system/Unstable_Grid/Grid";
import Axios from "axios";
import { useState, useEffect } from "react";
import { Button, CircularProgress } from "@mui/material";
import { AddRounded, ArrowBack } from "@mui/icons-material";
import { ClientCard } from "../components/ClientCard";
import { useNavigate } from "react-router-dom";

export const UserClientList = ({ checkLoggedInState, email, token }) => {
  const goBack = () => {
    navigation("/home", { replace: true });
  };

  const navigation = useNavigate();
  const [userClients, setUserClients] = useState(null);

  const onAddNewClient = () => {
    navigation("/assignClient", { replace: true });
  };

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

  if (!token || !email) {
    checkLoggedInState();
    return null;
  }

  return (
    <Grid container spacing={3}>
      <Grid xs={12}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <Button
            onClick={goBack}
            variant={"contained"}
            startIcon={<ArrowBack />}
          >
            Go back
          </Button>
        </div>
      </Grid>
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
  );
};
