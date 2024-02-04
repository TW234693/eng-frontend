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

const emptyMeal = {
  name: "",
  instructions: "",
  minutesCookingTime: 0,
  mealDate: moment.utc(),
  photo: "",
};

export const MealCard = ({
  isEditable,
  ingredients,
  clientDetails,
  onRemoveIngredient,
  checkLoggedInState,
  initialMealData = emptyMeal,
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

  const [mealPhoto, setMealPhoto] = useState(initialMealData.photo);

  const [mealName, setMealName] = useState(initialMealData.name);
  const [mealNameError, setMealNameError] = useState("");
  useEffect(() => {
    if (!mealName) {
      setMealNameError("Please provide a name for the meal.");
      return;
    }
    setMealNameError("");
  }, [mealName]);

  const [mealInstructions, setMealInstructions] = useState(
    initialMealData.instructions
  );
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

  const [mealMinutesCookingTime, setMealMinutesCookingTime] = useState(
    initialMealData.minutesCookingTime
  );
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

  const [mealDate, setMealDate] = useState(initialMealData.mealDate);
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
  const onAddOrEditMeal = () => {
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

    const requestURL = `//localhost:3500/meals/${
      initialMealData
        ? `updateMeal/id=${initialMealData._id}`
        : `createMeal/clientEmail=${clientDetails.email}`
    }`;

    const headers = {
      headers: { Authorization: `Bearer ${loggedInUserToken}` },
    };

    const onRequestSuccess = (res) => {
      const responseMessage = res.data.message;
      setShowErrors(false);
      setResponseMessage(responseMessage);
      setOpenSnackbar(true);
      setSuccess(true);
      // console.log(responseMessage);
    };

    const onRequestFail = (error) => {
      const responseMessage = error.response.data.message;
      // console.log(responseMessage);
      setOpenSnackbar(true);
      setSuccess(false);
      setResponseMessage(responseMessage);
    };

    if (initialMealData) {
      Axios.patch(requestURL, mealRequestObject, headers)
        .then(onRequestSuccess)
        .catch(onRequestFail);
    } else {
      Axios.post(requestURL, mealRequestObject, headers)
        .then(onRequestSuccess)
        .catch(onRequestFail);
    }
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
        {isEditable ? (
          <>
            <ListItem disablePadding>
              <Button
                onClick={toggleEditMode}
                startIcon={editMode ? <Save /> : <Edit />}
                fullWidth
              >
                {editMode ? "Save changes" : "Start editing"}
              </Button>
            </ListItem>
            <ListItem disablePadding>
              <Button
                onClick={onAddOrEditMeal}
                startIcon={<Add />}
                fullWidth
                color="success"
              >
                {initialMealData
                  ? "Finish and save the meal"
                  : "Finish and add the meal"}
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
          </>
        ) : null}

        {addMealError ? (
          <ListItem fullWidth>
            <Alert severity="error" style={{ width: "100%" }}>
              {addMealError}
            </Alert>
          </ListItem>
        ) : null}
        <ListItem disablePadding>
          {editMode && isEditable ? (
            <TextField
              label={"Meal Photo URL"}
              type="url"
              value={mealPhoto}
              placeholder="If left empty, the above default image will be used."
              onChange={(e) => setMealPhoto(e.target.value)}
              sx={{ m: "10px" }}
              fullWidth
            />
          ) : // <ListItemText
          //   style={{
          //     whiteSpace: "pre-wrap",
          //   }}
          //   primary={`Meal image URL:\n${
          //     mealPhoto ? mealPhoto : "(Default image)"
          //   }`}
          // />
          null}
        </ListItem>
        <Divider />
        <ListItem disablePadding>
          {editMode && isEditable ? (
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
          ) : (
            <ListItemText primary={`Meal name: ${mealName}`} />
          )}
        </ListItem>
        <Divider />
        <ListItem disablePadding>
          {editMode && isEditable ? (
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
          ) : (
            <ListItemText
              primary={`Cooking time: ${mealMinutesCookingTime} minutes`}
            />
          )}
        </ListItem>
        <Divider />
        <ListItem disablePadding>
          {editMode && isEditable ? (
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
          ) : (
            <ListItemText
              primary={`Meal date: ${moment(mealDate).format(
                "dddd (YYYY.MM.DD)"
              )}`}
            />
          )}
        </ListItem>
        <Divider />
        <ListItem disablePadding>
          {editMode && isEditable ? (
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
          ) : (
            <ListItemText
              style={{ whiteSpace: "pre-wrap" }}
              primary={`Recipe:\n${mealInstructions}`}
            />
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
                // console.log("nutrients");
                // console.log(nutrients);
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
                          {isEditable ? (
                            <Button
                              variant="outlined"
                              color="error"
                              onClick={() => onRemoveIngredient(ingredient)}
                            >
                              <DeleteForever />
                            </Button>
                          ) : null}
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
