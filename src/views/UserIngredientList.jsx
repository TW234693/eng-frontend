import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import {
  Button,
  Grid,
  CircularProgress,
  Dialog,
  DialogContent,
  Card,
} from "@mui/material";
import { ArrowBack, Add } from "@mui/icons-material";
import { IngredientCard } from "../components/IngredientCard";
import { useTranslation } from "react-i18next";

export const UserIngredientList = ({ checkLoggedInState, email, token }) => {
  const { t } = useTranslation();
  const goBack = () => {
    navigation("/home", { replace: true });
  };

  const navigation = useNavigate();
  const [userIngredients, setUserIngredients] = useState(null);
  const [noIngredients, setNoIngredients] = useState(false);
  const [dialogOpened, setDialogOpened] = useState(false);

  const onAddNewIngredient = () => {
    setDialogOpened(true);
  };

  useEffect(() => {
    Axios.get(`//localhost:3500/users/getIngredients/email=${email}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        console.log("response");
        console.log(res);
        if (!res.data.ingredients) {
          setNoIngredients(true);
        } else {
          setUserIngredients(res.data.ingredients);
        }
      })
      .catch(() => {
        console.log("something went wrong when fetching user ingredients");
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
              {`${t("go_back")}`}
            </Button>
            <Button
              onClick={onAddNewIngredient}
              variant={"contained"}
              startIcon={<Add />}
              color="success"
            >
              {`${t("ingredientList_addNewIngredient")}`}
            </Button>
          </div>
        </Grid>
        {userIngredients && !noIngredients ? (
          userIngredients.map((ingredient, i) => {
            return (
              <Grid item xs={4} key={i}>
                <IngredientCard
                  ingredient={ingredient}
                  isEditable={true}
                  token={token}
                />
              </Grid>
            );
          })
        ) : noIngredients ? (
          <>
            <Grid item xs={3}></Grid>
            <Grid item xs={6}>
              <Card>
                <h3>{`${t("ingredientList_noIngredients")}`}</h3>
              </Card>
            </Grid>
            <Grid item xs={3}></Grid>
          </>
        ) : (
          <Grid item xs={12}>
            <h2>{`${t("ingredientList_fetchingData")}`}</h2>
            <CircularProgress color="success" />
          </Grid>
        )}
      </Grid>
      <Dialog
        open={dialogOpened}
        onClose={() => setDialogOpened(false)}
        style={{ background: "rgb(0,0,0,0.8)" }}
        fullWidth
      >
        <DialogContent>
          <h2 style={{ textAlign: "center" }}>{`${t(
            "ingredientList_createNewIngredient"
          )}`}</h2>
          <IngredientCard isEditable={true} token={token} isOpened={true} />
        </DialogContent>
      </Dialog>
    </>
  );
};
