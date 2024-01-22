import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  List,
  ListItem,
  ListItemText,
  TextField,
  Alert,
  CardMedia,
  Divider,
  Snackbar,
} from "@mui/material";
import { DeleteForever, Edit, Save, Add } from "@mui/icons-material";
import moment from "moment";
import Axios from "axios";
import { NUTRIENTS } from "../utils/Nutrients";

export const MealCard = ({
  ingredients,
  clientDetails,
  onRemoveIngredient,
  checkLoggedInState,
}) => {
  const [responseMessage, setResponseMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [success, setSuccess] = useState(false);

  const [showErrors, setShowErrors] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const [showNutrients, setShowNutrients] = useState(false);
  const toggleShowNutrients = () => {
    setShowNutrients(!showNutrients);
  };

  const [mealPhoto, setMealPhoto] = useState("");

  const [mealName, setMealName] = useState("");
  const [mealNameError, setMealNameError] = useState("");
  useEffect(() => {
    if (!mealName) {
      setMealNameError("Please provide a name for the meal.");
      return;
    }
    setMealNameError("");
  }, [mealName]);

  const [mealInstructions, setMealInstructions] = useState("");
  const [mealInstructionsError, setMealInstructionsError] = useState("");
  useEffect(() => {
    if (!mealInstructions) {
      setMealInstructionsError(
        "Please provide cooking instructions for the meal."
      );
    } else {
      setMealInstructionsError("");
    }
  }, [mealInstructions]);

  const [mealMinutesCookingTime, setMealMinutesCookingTime] = useState(0);
  const [mealMinutesCookingTimeError, setMealMinutesCookingTimeError] =
    useState("");
  useEffect(() => {
    if (!mealMinutesCookingTime) {
      setMealMinutesCookingTimeError(
        "Please provide the meal preperation time."
      );
      return;
    }
    setMealMinutesCookingTimeError("");
  }, [mealMinutesCookingTime]);

  const [mealDate, setMealDate] = useState(moment.utc());
  const [mealDateError, setMealDateError] = useState("");
  useEffect(() => {
    if (!mealDate) {
      setMealDateError("Please choose a date for the meal.");
    } else {
      setMealDateError("");
    }
  }, [mealDate]);

  const [addMealError, setAddMealError] = useState(null);
  const handleClose = (reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };
  const onAddNewMeal = () => {
    setShowErrors(true);

    if (
      !mealName ||
      !mealDate ||
      !mealInstructions ||
      !mealMinutesCookingTime ||
      !ingredients
    ) {
      setAddMealError(
        "Meal name, meal date, instructions, cooking time, and at least one ingredient is required."
      );
      return;
    }

    if (ingredients.length === 0) {
      setAddMealError("Meal does not contain any ingredients.");
      return;
    }

    if (
      mealNameError ||
      mealInstructionsError ||
      mealDateError ||
      mealMinutesCookingTimeError
    ) {
      setAddMealError("Please fix existing errors.");
      return;
    }

    const mealRequestObject = {
      name: mealName,
      instructions: mealInstructions,
      minutesCookingTime: mealMinutesCookingTime,
      mealDate,
      ingredients,
    };
    if (mealPhoto) {
      mealRequestObject.photo = mealPhoto;
    }

    if (!clientDetails) {
      setAddMealError(
        "An error has occured, please update the values and try again."
      );
      return;
    }

    // const clientEmail = clientDetails.email;

    const loggedInUserToken = localStorage.getItem("token");

    if (!loggedInUserToken) {
      setAddMealError(
        "An error has occured, please try to log out and in again."
      );
      checkLoggedInState();
      return;
    }

    Axios.post(
      `//localhost:3500/meals/createMeal/clientEmail=${clientDetails.email}`,
      mealRequestObject,
      {
        headers: { Authorization: `Bearer ${loggedInUserToken}` },
      }
    )
      .then((res) => {
        const responseMessage = res.data.message;
        setShowErrors(false);
        setResponseMessage(responseMessage);
        setOpenSnackbar(true);
        setSuccess(true);
        console.log(responseMessage);
      })
      .catch((error) => {
        const responseMessage = error.response.data.message;
        console.log(responseMessage);
        setOpenSnackbar(true);
        setSuccess(false);
        setResponseMessage(responseMessage);
      });
  };

  return (
    <Card
      raised
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        position: "relative",
        padding: "10px",
      }}
    >
      <CardMedia
        component="img"
        image={
          mealPhoto
            ? `${mealPhoto}`
            : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3bdxwcdCX-_0GQAFHcZrOHgyLVlvF1P0BbxlVTiENdYIErIoqH4PQYmPs-fVnxeLP_XA&usqp=CAUs"
        }
        sx={{
          width: "80%",
          aspectRatio: 1,
          maxHeight: "200px",
          minHeight: "200px",
          objectFit: "contain",
        }}
      />
      <List style={{ width: "80%" }}>
        <ListItem>
          <Button
            onClick={toggleEditMode}
            startIcon={editMode ? <Save /> : <Edit />}
            fullWidth
          >
            {editMode ? "Save changes" : "Start editing"}
          </Button>
        </ListItem>
        <ListItem>
          <Button
            onClick={onAddNewMeal}
            startIcon={<Add />}
            fullWidth
            color="success"
          >
            Finish and add the meal
          </Button>
          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={handleClose}
          >
            <Alert
              onClose={handleClose}
              severity={success ? "success" : "error"}
              sx={{ width: "100%" }}
            >
              {responseMessage}
            </Alert>
          </Snackbar>
        </ListItem>

        {addMealError ? (
          <ListItem fullWidth>
            <Alert severity="error" style={{ width: "100%" }}>
              {addMealError}
            </Alert>
          </ListItem>
        ) : null}
        <ListItem disablePadding>
          {!editMode ? (
            <ListItemText
              style={{
                whiteSpace: "pre-wrap",
              }}
              primary={`Meal image URL:\n${
                mealPhoto ? mealPhoto : "(Default image)"
              }`}
            />
          ) : (
            <TextField
              label={"Meal Photo URL"}
              type="url"
              value={mealPhoto}
              placeholder="If left empty, the above default image will be used."
              onChange={(e) => setMealPhoto(e.target.value)}
              sx={{ m: "10px" }}
              fullWidth
            />
          )}
        </ListItem>
        <Divider />
        <ListItem disablePadding>
          {!editMode ? (
            <ListItemText primary={`Meal name: ${mealName}`} />
          ) : (
            <>
              <TextField
                label={"Meal Name"}
                type="text"
                value={mealName}
                placeholder="Meal name"
                onChange={(e) => setMealName(e.target.value)}
                color={mealNameError && showErrors ? "error" : "primary"}
                sx={{ m: "10px" }}
                fullWidth
              />
              {mealNameError && showErrors ? (
                <Alert severity="error" variant="filled">
                  {mealNameError}
                </Alert>
              ) : null}
            </>
          )}
        </ListItem>
        <Divider />
        <ListItem disablePadding>
          {!editMode ? (
            <ListItemText
              primary={`Cooking time: ${mealMinutesCookingTime} minutes`}
            />
          ) : (
            <>
              <TextField
                label={"Cooking time in minutes"}
                type="number"
                value={mealMinutesCookingTime}
                placeholder="Cooking time"
                onChange={(e) =>
                  setMealMinutesCookingTime(
                    Math.max(Math.floor(e.target.value), 0)
                  )
                }
                color={
                  mealMinutesCookingTimeError && showErrors
                    ? "error"
                    : "primary"
                }
                sx={{ m: "10px" }}
                fullWidth
              />
              {mealMinutesCookingTimeError && showErrors ? (
                <Alert severity="error" variant="filled">
                  {mealMinutesCookingTimeError}
                </Alert>
              ) : null}
            </>
          )}
        </ListItem>
        <Divider />
        <ListItem disablePadding>
          {!editMode ? (
            <ListItemText
              primary={`Meal date: ${moment(mealDate).format(
                "dddd (YYYY.MM.DD)"
              )}`}
            />
          ) : (
            <>
              <TextField
                label={"Meal Date"}
                type="date"
                value={mealDate}
                placeholder="Meal name"
                onChange={(e) => setMealDate(e.target.value)}
                color={mealDateError && showErrors ? "error" : "primary"}
                sx={{ m: "10px" }}
                fullWidth
              />
              {mealDateError && showErrors ? (
                <Alert severity="error" variant="filled">
                  {mealDateError}
                </Alert>
              ) : null}
            </>
          )}
        </ListItem>
        <Divider />
        <ListItem disablePadding>
          {!editMode ? (
            <ListItemText
              style={{ whiteSpace: "pre-wrap" }}
              primary={`Recipe:\n${mealInstructions}`}
            />
          ) : (
            <>
              <TextField
                multiline
                minRows={3}
                maxRows={Infinity}
                label={"Recipe"}
                type="text"
                value={mealInstructions}
                placeholder="Cooking recipe"
                onChange={(e) => setMealInstructions(e.target.value)}
                color={
                  mealInstructionsError && showErrors ? "error" : "primary"
                }
                sx={{ m: "10px" }}
                fullWidth
              />
              {mealInstructionsError && showErrors ? (
                <Alert severity="error" variant="filled">
                  {mealInstructionsError}
                </Alert>
              ) : null}
            </>
          )}
        </ListItem>

        {ingredients && ingredients.length ? (
          <>
            <Divider />
            <ListItem>
              <Button
                onClick={toggleShowNutrients}
                startIcon={<List />}
                fullWidth
              >
                {showNutrients ? "Show ingredients" : "Show nutrients"}
              </Button>
            </ListItem>
            {showNutrients ? (
              (() => {
                const nutrients = ingredients.reduce(
                  (totalNutrients, currentIngredient) => {
                    currentIngredient.nutrients.forEach((nutrient) => {
                      totalNutrients[nutrient.code] = totalNutrients[
                        nutrient.code
                      ]
                        ? totalNutrients[nutrient.code] +
                          currentIngredient.quantityGrams * nutrient.quantity
                        : currentIngredient.quantityGrams * nutrient.quantity;
                    });
                    return totalNutrients;
                  },
                  {}
                );
                console.log("nutrients");
                console.log(nutrients);
                return (
                  <>
                    {Object.entries(nutrients).map(
                      ([nutrientCode, nutrientAmount], index) => {
                        const nutrientInfo = NUTRIENTS.find(
                          (e) => e.code === nutrientCode
                        );
                        if (!nutrientInfo) {
                          return null;
                        }
                        return (
                          <React.Fragment key={index}>
                            {index > 0 ? <Divider /> : null}
                            <ListItem
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <span>{nutrientInfo.label}:</span>
                              <span>
                                {nutrientAmount.toFixed(3).toString()}
                                {nutrientInfo.unit}
                              </span>
                            </ListItem>
                          </React.Fragment>
                        );
                      }
                    )}
                  </>
                );
              })()
            ) : (
              <>
                {ingredients.map((ingredient, index) => {
                  console.log(ingredient);
                  return (
                    <React.Fragment key={index}>
                      {index > 0 ? <Divider /> : null}
                      <ListItem>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "100%",
                            alignItems: "center",
                          }}
                        >
                          <span>
                            {ingredient.name} ({ingredient.quantityGrams}g)
                          </span>
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => onRemoveIngredient(ingredient)}
                          >
                            <DeleteForever />
                          </Button>
                        </div>
                      </ListItem>
                    </React.Fragment>
                  );
                })}
              </>
            )}
          </>
        ) : null}
      </List>
    </Card>
  );
};
