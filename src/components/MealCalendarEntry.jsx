import { Button } from "@mui/material";
import { Edit, DeleteForever } from "@mui/icons-material";
import Axios from "axios";
import { MealCard } from "../components/MealCard";
import { useNavigate } from "react-router-dom";

export const MealCalendarEntry = ({
  meal,
  isEditable,
  clientDetails,
  isTemplate = false,
  onClick = null,
}) => {
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
    console.log(isTemplate);
    navigation(
      `${isTemplate ? "/" : ""}editMeal${isTemplate ? "Template" : ""}/${
        meal._id
      }`,
      {
        replace: isTemplate,
        state: { clientDetails, meal, isTemplate },
      }
    );
  };

  return (
    <>
      <div
        style={{
          display: isEditable ? "flex" : "none",
          padding: "5px 0",
          justifyContent: "space-between",
        }}
      >
        <Button onClick={(e) => onDelete(e)} variant="contained" color="error">
          <DeleteForever /> Delete
        </Button>
        <Button onClick={(e) => onEdit(e)} variant="contained">
          <Edit /> Edit
        </Button>
      </div>
      <div
        onClick={() => {
          if (onClick) {
            onClick();
          }
        }}
        style={{
          cursor: onClick ? "pointer" : "unset",
        }}
      >
        <MealCard
          ingredients={meal.ingredients}
          isEditable={false}
          clientDetails={null}
          onRemoveIngredient={() => {}}
          checkLoggedInState={() => {}}
          initialMealData={meal}
        />
      </div>
    </>
  );
};
