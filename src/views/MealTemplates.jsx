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
// import { IngredientCard } from "../components/IngredientCard";
import { MealCalendarEntry } from "../components/MealCalendarEntry";

export const MealTemplates = ({ checkLoggedInState, email, token }) => {
  const goBack = () => {
    navigation("/home", { replace: true });
  };

  const navigation = useNavigate();
  const [userTemplates, setUserTemplates] = useState(null);

  const [dialogOpened, setDialogOpened] = useState(false);

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
              Go back
            </Button>
            <Button
              onClick={onAddNewTemplate}
              variant={"contained"}
              startIcon={<Add />}
              color="success"
            >
              Add new template
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
            <h2>Fetching templates data...</h2>
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
          <h2>Create a new template</h2>
          {/* <IngredientCard isEditable={true} token={token} /> */}
        </DialogContent>
      </Dialog>
    </>
  );
};
