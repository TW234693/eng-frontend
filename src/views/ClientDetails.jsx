import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, CircularProgress, Grid } from "@mui/material";
import Axios from "axios";
import { ArrowBack, Add } from "@mui/icons-material";
import { ClientCard } from "../components/ClientCard";
import { MealCalendar } from "../components/MealCalendar";
import { useTranslation } from "react-i18next";

export const ClientDetails = ({ checkLoggedInState }) => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [dataFetched, setDataFetched] = useState(false);
  const [clientDetails, setClientDetails] = useState(null);
  const [clientMeals, setClientMeals] = useState(null);
  const [hasMeals, setHasMeals] = useState(null);

  const navigation = useNavigate();

  const goBack = () => {
    navigation("/myClients", { replace: true });
  };

  const onAddMeal = () => {
    navigation(`addMeal`, { state: { clientDetails } });
  };

  const roles = localStorage.getItem("roles");
  const email = localStorage.getItem("email");
  const token = localStorage.getItem("token");

  if (!email || !token || !roles || !id) {
    checkLoggedInState();
  }

  useEffect(() => {
    Axios.get(`//localhost:3500/users/getClients/email=${email}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        const clients = res.data.clients;

        if (!clients) {
          console.error("No clients found for this user");
          setTimeout(() => {
            navigation("/myClients", { replace: true });
          }, 2000);
          return;
        }

        const lookedForClient = clients.find((client) => client._id === id);
        if (!lookedForClient) {
          console.error(`Looked for client with ID ${id} was not found`);
          setTimeout(() => {
            navigation("/myClients", { replace: true });
          }, 2000);
          return;
        }

        setClientDetails(lookedForClient);
        setDataFetched(true);
      })
      .catch(() => {
        checkLoggedInState();
      });
  }, [email, token, id, navigation, checkLoggedInState]);

  useEffect(() => {
    if (!clientDetails) {
      return;
    }

    Axios.get(
      `//localhost:3500/clients/getMeals/email=${clientDetails.email}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((res) => {
        const meals = res.data;

        if (!meals && !Array.isArray(meals)) {
          console.error("Something went wrong when fetching client's meals");
          setTimeout(() => {
            navigation("/myProfile", { replace: true });
          }, 2000);
          return;
        }

        if (!meals) {
          setClientMeals([]);
          setHasMeals(false);
        } else {
          setClientMeals(meals);
          setHasMeals(true);
        }
        setDataFetched(true);
      })
      .catch(() => {
        checkLoggedInState();
      });
  }, [clientDetails, navigation, token, checkLoggedInState]);

  if (!id) {
    navigation("/myClients", { replace: true });
    return <h2>No client Id found</h2>;
  }

  return (
    <>
      {dataFetched ? (
        <>
          <Grid container spacing={3}>
            <Grid item xs={12}>
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
                  {`${t("go_back")}`}
                </Button>
                <Button
                  onClick={onAddMeal}
                  variant={"contained"}
                  startIcon={<Add />}
                  color="success"
                >
                  {`${t("client_addNewMeal")}`}
                </Button>
              </div>
            </Grid>
            <Grid item xs={4}>
              <ClientCard
                client={clientDetails}
                navigation={navigation}
                showDetailsButton={false}
              />
            </Grid>
            <Grid item xs={8}>
              {clientMeals && hasMeals ? (
                <MealCalendar
                  clientMeals={clientMeals}
                  clientDetails={clientDetails}
                />
              ) : (
                <h3>{`${t("client_noMeals")}`}</h3>
              )}
            </Grid>
          </Grid>
        </>
      ) : (
        <>
          <h2>{`${t("client_fetchingData")}`}</h2>
          <CircularProgress color="success" />
        </>
      )}
    </>
  );
};
