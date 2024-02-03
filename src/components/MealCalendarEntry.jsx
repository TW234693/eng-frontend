import { Button } from "@mui/material";
import { Edit, DeleteForever } from "@mui/icons-material";
import Axios from "axios";

export const MealCalendarEntry = ({ meal }) => {
  const onDetails = () => {
    console.log(meal);
  };

  const onDelete = (e) => {
    e.stopPropagation();

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
    console.log("edit");
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "5px",
        justifyContent: "space-between",
        fontWeight: "bold",
        width: "30vw",
        cursor: "pointer",
      }}
      onClick={onDetails}
    >
      <div>
        <img
          src={meal.photo}
          style={{
            objectFit: "fill",
            maxHeight: "100px",
            minHeight: "100px",
            minWidth: "100px",
            maxWidth: "100px",
            margin: "0 10px",
            display: "inline",
          }}
        />
      </div>
      <div>
        <p>{meal.name}</p>
        <p>Cooking time: {meal.minutesCookingTime} min.</p>
      </div>
      <div>
        <Button onClick={(e) => onDelete(e)} variant="outlined" color="error">
          <DeleteForever />
        </Button>
        <Button onClick={(e) => onEdit(e)} variant="outlined">
          <Edit />
        </Button>
      </div>
    </div>
  );
};
