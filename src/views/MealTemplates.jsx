import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { Button, Grid, CircularProgress } from "@mui/material";
import { ArrowBack, Add } from "@mui/icons-material";
import { MealCalendarEntry } from "../components/MealCalendarEntry";
import { useTranslation } from "react-i18next";

export const MealTemplates = ({ checkLoggedInState, email, token }) => {
  const { t } = useTranslation();
  const goBack = () => {
    navigation("/home", { replace: true });
  };

  const navigation = useNavigate();
  const [userTemplates, setUserTemplates] = useState(null);

  const onAddNewTemplate = () => {
    navigation(`/addMealTemplate`, {
      replace: true,
      state: { isTemplate: true },
    });
  };

  useEffect(() => {
    Axios.get(`//localhost:3500/users/getMealTemplates/email=${email}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        console.log(res.data.meals);
        setUserTemplates(res.data.meals);
      })
      .catch(() => {
        console.log("Something went wrong when fetching user templates.");
      });
  }, [email, token]);

  if (!token || !email) {
    checkLoggedInState();
    return null;
  }

  return (
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
            <Button
              onClick={onAddNewTemplate}
              variant={"contained"}
              startIcon={<Add />}
              color="success"
            >
              {t("templates_addnewTemplate")}
            </Button>
          </div>
        </Grid>
        {userTemplates ? (
          userTemplates.map((template, i) => {
            return (
              <Grid item xs={4} key={i}>
                <MealCalendarEntry
                  meal={template}
                  isEditable={true}
                  clientDetails={null}
                  isTemplate={true}
                />
              </Grid>
            );
          })
        ) : (
          <Grid item xs={12}>
            <h2>{t("templates_fetchingData")}</h2>
            <CircularProgress color="success" />
          </Grid>
        )}
      </Grid>
    </>
  );
};
