import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Grid, Button, Alert, Dialog, DialogContent } from "@mui/material";
import { ArrowBack, MenuBook } from "@mui/icons-material";
import { MealCard } from "../components/MealCard";
import { NewIngredient } from "../components/NewIngredient";
import Axios from "axios";
import { Transition } from "../components/MealCalendar";
import { MealCalendarEntry } from "../components/MealCalendarEntry";

export const AddOrEditMeal = ({ checkLoggedInState, token }) => {
  const [dialogOpened, setDialogOpened] = useState(false);
  const [dialogMeals, setDialogMeals] = useState([]);

  const [clientDetails, setClientDetails] = useState(null);
  const [mealIngredients, setMealingredients] = useState(null);
  const [initialMealData, setInitialMealData] = useState(null);
  const [isTemplate, setIsTemplate] = useState(false);
  const onAddIngredient = (newIngredient) => {
    if (Array.isArray(mealIngredients)) {
      setMealingredients([...mealIngredients, newIngredient]);
    } else {
      setMealingredients([newIngredient]);
    }
  };

  const onRemoveIngredient = (removeIngredient) => {
    setMealingredients(
      mealIngredients.filter((ingredient) => {
        return ingredient.name !== removeIngredient.name;
      })
    );
  };

  const { id, mealId } = useParams();
  const location = useLocation();
  const navigation = useNavigate();

  const onCloseDialog = () => {
    setDialogOpened(false);
    setDialogMeals([]);
  };

  const onOpenDialog = () => {
    const loggedInUserEmail = localStorage.getItem("email");

    Axios.get(
      `//localhost:3500/users/getMealTemplates/email=${loggedInUserEmail}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((res) => {
        const templateMeals = res.data.meals;
        setDialogOpened(true);
        setDialogMeals(templateMeals);
      })
      .catch(() => {
        console.log("Something went wrong when fetching user templates.");
      });
  };

  const onGoBack = () => {
    if (id) {
      navigation(`/clientDetails/${id}`, { replace: true });
    } else if (isTemplate) {
      navigation(`/myMealTemplates`, { replace: true });
    } else {
      navigation(`/home`, { replace: true });
    }
  };

  const onChooseTemplate = (meal) => {
    setMealingredients(meal.ingredients);
    setInitialMealData({ ...meal, _id: mealId });
    setDialogOpened(false);
    setDialogMeals([]);
  };

  useEffect(() => {
    if (location.state) {
      if (location.state.clientDetails) {
        setClientDetails(location.state.clientDetails);
      }
      if (location.state.meal) {
        setMealingredients(location.state.meal.ingredients);
        setInitialMealData({ ...location.state.meal, _id: mealId });
      }
      if (location.state.isTemplate) {
        setIsTemplate(location.state.isTemplate);
      }
    }
  }, [location.state, mealId]);

  if (!clientDetails && !isTemplate) {
    navigation("/myClients", { replace: true });
    return <h2>No client details found.</h2>;
  }

  return (
    <Grid container spacing={3} padding="10px">
      <Grid item xs={12}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <Button
            onClick={onGoBack}
            variant={"contained"}
            startIcon={<ArrowBack />}
          >
            Go back
          </Button>
          {!isTemplate && (
            <Button
              onClick={onOpenDialog}
              variant="contained"
              startIcon={<MenuBook />}
              color="success"
            >
              Use a template
            </Button>
          )}
        </div>
      </Grid>
      <Dialog
        open={dialogOpened}
        onClose={onCloseDialog}
        style={{ background: "rgba(0,0,0,0.5)" }}
        TransitionComponent={Transition}
        fullWidth
        maxWidth="lg"
      >
        <DialogContent>
          <Grid container spacing={4}>
            <Grid xs={12} item>
              <Alert severity="warning">
                Using a template will erase the current configuration of the
                form.
              </Alert>
            </Grid>
            {dialogMeals.map((meal, id) => {
              return (
                <Grid item xs={6} key={id}>
                  <MealCalendarEntry
                    meal={meal}
                    isEditable={false}
                    clientDetails={null}
                    style={{ border: "none", boxShadow: "none" }}
                    isTemplate={true}
                    onClick={() => onChooseTemplate(meal)}
                  />
                </Grid>
              );
            })}
          </Grid>
        </DialogContent>
      </Dialog>
      <Grid item xs={6}>
        <MealCard
          ingredients={mealIngredients}
          isEditable={true}
          clientDetails={clientDetails}
          onRemoveIngredient={onRemoveIngredient}
          checkLoggedInState={checkLoggedInState}
          initialMealData={
            initialMealData !== null ? initialMealData : undefined
          }
          isTemplate={isTemplate}
        />
      </Grid>
      <Grid item xs={6}>
        <NewIngredient onAddIngredient={onAddIngredient} token={token} />
      </Grid>
    </Grid>
  );
};
