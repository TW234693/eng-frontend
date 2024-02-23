import { Button } from "@mui/material";
import { Edit, DeleteForever } from "@mui/icons-material";
import Axios from "axios";
import { MealCard } from "../components/MealCard";
import { useNavigate } from "react-router-dom";

export const MealCalendarEntry = ({ meal, isEditable, clientDetails }) => {
  const navigation = useNavigate();

  const onDelete = (e) => {
    e.stopPropagation();
    if (!isEditable) {
      return;
    }

    const loggedInUserToken = localStorage.getItem("token");

    Axios.delete(`//localhost:3500/meals/deleteMeal/id=${meal._id}`, {
      headers: { Authorization: `Bearer ${loggedInUserToken}` },
    })
      .then((res) => {
        const responseMessage = res.data.message;
        console.log(responseMessage);
        window.location.reload();
      })
      .catch((error) => {
        const responseMessage = error.response.data.message;
        console.log(responseMessage);
      });
  };

  const onEdit = (e) => {
    e.stopPropagation();
    if (!isEditable) {
      return;
    }
    console.log(meal);
    navigation(`editMeal/${meal._id}`, { state: { clientDetails, meal } });
  };

  return (
    <>
      <div
        style={{
          display: isEditable ? "flex" : "none",
          alignItems: "center",
          padding: "5px",
          justifyContent: "space-between",
          fontWeight: "bold",
          gap: "5%",
          cursor: "pointer",
        }}
      >
        <Button onClick={(e) => onDelete(e)} variant="outlined" color="error">
          <DeleteForever /> Delete
        </Button>
        <Button onClick={(e) => onEdit(e)} variant="outlined">
          <Edit /> Edit
        </Button>
      </div>

      <MealCard
        ingredients={meal.ingredients}
        isEditable={false}
        clientDetails={null}
        onRemoveIngredient={() => {}}
        checkLoggedInState={() => {}}
        initialMealData={meal}
      />
    </>
  );
};
