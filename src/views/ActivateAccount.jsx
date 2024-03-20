import Axios from "axios";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CircularProgress, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";

export const ActivateAccount = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [activationSuccess, setActivationSuccess] = useState(null);

  useEffect(() => {
    if (id) {
      Axios.post(`//localhost:3500/auth/activate/${id}`)
        .then((_) => {
          setActivationSuccess(true);
        })
        .catch((_) => {
          setActivationSuccess(false);
        });
    }
  }, [id]);

  if (!id) {
    return <h1>no id</h1>;
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={3} />
      <Grid item xs={6}>
        <Card>
          {activationSuccess === null ? (
            <>
              <h3>{t("activateAccount_waiting")}</h3>
              <CircularProgress />
            </>
          ) : setActivationSuccess ? (
            <>
              <h3>{t("activateAccount_successHeading")}</h3>
              <p>{t("activateAccount_successBody")}</p>
            </>
          ) : (
            <>
              <h3>{t("activateAccount_errorHeading")}</h3>
              <p>
                {t("activateAccount_errorBody1")}
                {id}
                {t("activateAccount_errorBody2")}
              </p>
            </>
          )}
        </Card>
      </Grid>
      <Grid item xs={3} />
    </Grid>
  );
};
