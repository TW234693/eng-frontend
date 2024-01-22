import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import {
  Button,
  Grid,
  CircularProgress,
  Dialog,
  DialogContent,
} from "@mui/material";
import { ArrowBack, Add } from "@mui/icons-material";
import { IngredientCard } from "../components/IngredientCard";

export const UserIngredientList = ({ checkLoggedInState, email, token }) => {
  const goBack = () => {
    navigation("/home", { replace: true });
  };

  const navigation = useNavigate();
  const [userIngredients, setUserIngredients] = useState(null);

  const [dialogOpened, setDialogOpened] = useState(false);

  const onAddNewIngredient = () => {
    // console.log("create ingredient");
    // navigation("/createIngredient", { replace: true });
    setDialogOpened(true);
  };

  useEffect(() => {
    Axios.get(`//localhost:3500/users/getIngredients/email=${email}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setUserIngredients(res.data.ingredients);
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
              Go back
            </Button>
            <Button
              onClick={onAddNewIngredient}
              variant={"contained"}
              startIcon={<Add />}
              color="success"
            >
              Add new ingredient
            </Button>
          </div>
        </Grid>
        {userIngredients ? (
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
        ) : (
          <Grid item xs={12}>
            <h2>Fetching ingredient data...</h2>
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
          <h2>Create a new ingredient</h2>
          <IngredientCard isEditable={true} token={token} />
        </DialogContent>
      </Dialog>
    </>
  );
};
