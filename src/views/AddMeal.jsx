import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Grid, Button } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { MealCard } from "../components/MealCard";
import { NewIngredient } from "../components/NewIngredient";

export const AddOrEditMeal = ({ checkLoggedInState, token }) => {
  const [clientDetails, setClientDetails] = useState(null);
  const [mealIngredients, setMealingredients] = useState(null);
  const [initialMealData, setInitialMealData] = useState(null);
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

  const { id } = useParams();
  const location = useLocation();
  const navigation = useNavigate();

  const onGoBack = () => {
    if (id) {
      navigation(`/clientDetails/${id}`, { replace: true });
    } else {
      navigation(`/myClients`, { replace: true });
    }
  };

  useEffect(() => {
    if (location.state) {
      if (location.state.clientDetails) {
        setClientDetails(location.state.clientDetails);
      }
      if (location.state.meal) {
        setMealingredients(location.state.meal.ingredients);
        setInitialMealData(location.state.meal);
      }
    }
  }, [location.state]);

  if (!clientDetails) {
    navigation("/myClients", { replace: true });
    return <h2>No client details found.</h2>;
  }

  return (
    <>
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
          </div>
        </Grid>
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
          />
        </Grid>
        <Grid item xs={6}>
          <NewIngredient onAddIngredient={onAddIngredient} token={token} />
        </Grid>
      </Grid>
    </>
  );
};
