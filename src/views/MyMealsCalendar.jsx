import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Card, CircularProgress, Grid } from "@mui/material";
import Axios from "axios";
import { ArrowBack } from "@mui/icons-material";
import { MealCalendar } from "../components/MealCalendar";
import { useTranslation } from "react-i18next";

export const MyMealsCalendar = ({ profile, token, checkLoggedInState }) => {
  const { t } = useTranslation();

  const [dataFetched, setDataFetched] = useState(false);
  const [clientMeals, setClientMeals] = useState(null);
  const [hasMeals, setHasMeals] = useState(null);

  const navigation = useNavigate();

  const goBack = () => {
    navigation("/home", { replace: true });
  };

  useEffect(() => {
    if (!profile || !token) {
      checkLoggedInState();
    } else {
      Axios.get(`//localhost:3500/clients/getMeals/email=${profile.email}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
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
        .catch((err) => {
          console.log(err);
        });
    }
  }, [navigation, token, profile, checkLoggedInState]);

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
                  {t("go_back")}
                </Button>
              </div>
            </Grid>
            <Grid item xs={2}></Grid>
            <Grid item xs={8}>
              {clientMeals && hasMeals ? (
                <MealCalendar
                  clientMeals={clientMeals}
                  clientDetails={profile}
                  isEditable={false}
                />
              ) : (
                <Card style={{ padding: "10px" }}>
                  {t("calendar_noMealsClient")}
                </Card>
              )}
            </Grid>
            <Grid item xs={2}></Grid>
          </Grid>
        </>
      ) : (
        <>
          <h2>{t("client_datchingMealData")}</h2>
          <CircularProgress color="success" />
        </>
      )}
    </>
  );
};
