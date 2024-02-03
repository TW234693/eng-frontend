import { useEffect, useState } from "react";
import { NUTRIENTS } from "../utils/Nutrients";
import {
  Button,
  Card,
  CardMedia,
  Divider,
  List,
  ListItem,
  TextField,
  InputAdornment,
  Alert,
  Snackbar,
} from "@mui/material";
import { Clear, DeleteForever, Edit, EditOff, Save } from "@mui/icons-material";
import { isEmpty, isObject } from "lodash";
import Axios from "axios";

export const IngredientCard = ({ ingredient = {}, isEditable, token }) => {
  const defaultPhoto =
    "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";
  const [inEditMode, setInEditMode] = useState(false);
  const [showNutrients, setShowNutrients] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const handleClose = (reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  const [photo, setPhoto] = useState(ingredient.photo ?? defaultPhoto);
  const [name, setName] = useState(ingredient.name ?? "");
  const [nameError, setNameError] = useState("");
  const [nutrients, setNutrients] = useState(ingredient.nutrients ?? NUTRIENTS);

  const [responseMsg, setResponseMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (name.length <= 0) {
      setNameError("The ingredient must have a name");
      return;
    }
    setNameError("");
  }, [name]);

  const deleteIngredient = () => {
    const requestURL = `//localhost:3500/ingredients/deleteIngredient/id=${ingredient._id}`;

    const auth = {
      headers: { Authorization: `Bearer ${token}` },
    };

    const handleSuccess = (res) => {
      const responseMessage = res.data.message;
      setShowErrors(false);
      setResponseMsg(responseMessage);
      setOpenSnackbar(true);
      setSuccess(true);
      window.location.reload();
    };

    const handleFailure = (error) => {
      const responseMessage = error.response.data.message;
      console.log(responseMessage);
      setOpenSnackbar(true);
      setSuccess(false);
      setResponseMsg(responseMessage);
    };

    Axios.delete(requestURL, auth)
      .then((res) => {
        handleSuccess(res);
      })
      .catch((error) => {
        handleFailure(error);
      });
  };

  const resetData = () => {
    setNutrients(ingredient.nutrients ?? NUTRIENTS);
    setName(ingredient.name ?? "");
    setPhoto(ingredient.photo ?? defaultPhoto);
    setShowErrors(false);
  };

  const onSaveChanges = () => {
    setShowErrors(true);

    if (nameError !== "") {
      return;
    }

    const isExistingIngredient =
      !isEmpty(ingredient) && isObject(ingredient) && ingredient._id;

    const ingredientTDO = {
      name,
      nutrients,
      photo,
    };

    const requestURL = `//localhost:3500/ingredients/${
      isExistingIngredient
        ? `updateIngredient/id=${ingredient._id}`
        : "createIngredient"
    }`;

    const auth = {
      headers: { Authorization: `Bearer ${token}` },
    };

    const handleSuccess = (res) => {
      const responseMessage = res.data.message;
      setShowErrors(false);
      setResponseMsg(responseMessage);
      setOpenSnackbar(true);
      setSuccess(true);
    };

    const handleFailure = (error) => {
      const responseMessage = error.response.data.message;
      console.log(responseMessage);
      setOpenSnackbar(true);
      setSuccess(false);
      setResponseMsg(responseMessage);
    };

    if (isExistingIngredient) {
      Axios.patch(requestURL, ingredientTDO, auth)
        .then((res) => {
          handleSuccess(res);
        })
        .catch((error) => {
          handleFailure(error);
        });
    } else {
      Axios.post(requestURL, ingredientTDO, auth)
        .then((res) => {
          handleSuccess(res);
          window.location.reload();
        })
        .catch((error) => {
          handleFailure(error);
        });
    }
  };

  const updateNutrients = (nutrientQuantity, nutrientCode) => {
    const updatedNutrients = nutrients.map((nutrient) => {
      if (nutrient.code === nutrientCode) {
        return { ...nutrient, quantity: nutrientQuantity };
      } else {
        return nutrient;
      }
    });

    setNutrients(updatedNutrients);
  };

  return (
    <Card
      raised
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        padding: "10px",
      }}
    >
      <Snackbar open={openSnackbar && isEditable} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={success ? "success" : "error"}
          sx={{ width: "100%" }}
        >
          {responseMsg}
        </Alert>
      </Snackbar>
      <div>
        <CardMedia
          component="img"
          image={photo ? photo : defaultPhoto}
          sx={{
            maxHeight: "200px",
            minHeight: "200px",
            minWidth: "200px",
            maxWidth: "200px",
            objectFit: "fill",
            display: "inline",
            aspectRatio: "1",
            margin: "0 10px",
          }}
        />
        <CardMedia
          component="img"
          image={photo ? photo : defaultPhoto}
          sx={{
            objectFit: "fill",
            maxHeight: "100px",
            minHeight: "100px",
            minWidth: "100px",
            maxWidth: "100px",
            margin: "0 10px",
            display: `${isEditable ? "inline" : "none"}`,
          }}
        />
        <CardMedia
          component="img"
          image={photo ? photo : defaultPhoto}
          sx={{
            objectFit: "fill",
            maxHeight: "50px",
            minHeight: "50px",
            minWidth: "50px",
            maxWidth: "50px",
            margin: "0 10px",
            display: `${isEditable ? "inline" : "none"}`,
          }}
        />
      </div>
      <List style={{ width: "100%" }}>
        {isEditable && (
          <ListItem disablePadding>
            <Button
              onClick={() => setInEditMode(!inEditMode)}
              startIcon={!inEditMode ? <Edit /> : <EditOff />}
              fullWidth
              color="info"
            >
              {inEditMode ? "Stop Editing" : "Start editing"}
            </Button>
          </ListItem>
        )}
        {inEditMode && (
          <>
            <ListItem disablePadding>
              <Button
                onClick={onSaveChanges}
                startIcon={<Save />}
                fullWidth
                variant="contained"
                color="success"
              >
                Save Changes
              </Button>
            </ListItem>
            <ListItem disablePadding>
              <Button
                onClick={resetData}
                startIcon={<Clear />}
                fullWidth
                color="error"
              >
                Reset changes
              </Button>
            </ListItem>
          </>
        )}
        <ListItem>
          {
            inEditMode ? (
              <TextField
                label={"Ingredient picture URL"}
                type="url"
                value={photo}
                placeholder="(Default image)"
                onChange={(e) => setPhoto(e.target.value)}
                onBlur={(e) =>
                  setPhoto(e.target.value ? e.target.value : defaultPhoto)
                }
                fullWidth
              />
            ) : null
            // (
            //   <ListItemText
            //     style={{
            //       whiteSpace: "pre-wrap",
            //       display: `${isEditable ? "auto" : "none"}`,
            //     }}
            //     primary={`Ingredient picture :\n${
            //       photo !== defaultPhoto ? photo : "(Default image)"
            //     }`}
            //   />
            // )
          }
        </ListItem>
        <ListItem>
          {!inEditMode ? (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                margin: "4px 0",
              }}
            >
              <span>Ingredient name:</span>
              <span>{name}</span>
            </div>
          ) : (
            // <ListItemText primary={`First name: ${name}`} />
            <TextField
              label={"Ingredient name"}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={nameError.length > 0 && showErrors}
              fullWidth
            />
          )}
        </ListItem>
        {nameError && showErrors && inEditMode ? (
          <ListItem>
            <Alert severity="error" variant="filled">
              {nameError}
            </Alert>
          </ListItem>
        ) : null}
        <ListItem>
          <Button onClick={() => setShowNutrients(!showNutrients)} fullWidth>
            {showNutrients ? "Hide nutrients" : "Show nutrients"}
          </Button>
        </ListItem>
        <Divider
          textAlign="center"
          sx={{ display: showNutrients ? "auto" : "none" }}
        >
          <b>Nutritional values per gram</b>
        </Divider>
        {showNutrients
          ? inEditMode
            ? nutrients.map((nutrient, index) => (
                <ListItem
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <TextField
                    label={nutrient.label}
                    type="number"
                    value={nutrient.quantity}
                    onChange={(e) =>
                      updateNutrients(Number(e.target.value), nutrient.code)
                    }
                    onFocus={(event) => {
                      event.target.select();
                    }}
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {nutrient.unit}
                        </InputAdornment>
                      ),
                      min: 0,
                    }}
                  />
                </ListItem>
              ))
            : nutrients.map((nutrient, index) => (
                <ListItem
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>{nutrient.label}</span>
                  <span>
                    {nutrient.quantity}
                    {nutrient.unit}
                  </span>
                </ListItem>
              ))
          : null}
        {isEditable && (
          <ListItem>
            <Button
              onClick={deleteIngredient}
              fullWidth
              color="error"
              variant="contained"
              startIcon={<DeleteForever />}
            >
              Delete ingredient
            </Button>
          </ListItem>
        )}
      </List>
    </Card>
  );
};
