import {
  List,
  ListItem,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Typography,
  Divider,
} from "@mui/material";
import { useState } from "react";
import { Search } from "@mui/icons-material";
import Axios from "axios";
import { NUTRIENTS } from "../utils/Nutrients";

const GRAM_UNIT_URL =
  "http://www.edamam.com/ontologies/edamam.owl#Measure_gram";

const DEFAULT_IMAGE =
  "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";

const BASIC_NUTRIENTS_CODES = [
  "CHOCDF",
  "ENERC_KCAL",
  "ENERC_KCAL",
  "FAT",
  "FIBTG",
  "PROCNT",
];

export const NewIngredient = ({ onAddIngredient, token }) => {
  const [nextFromEdamam, setNextFromEdamam] = useState(true);
  const [lastFromEdamam, setLastFromEdamam] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchWasMade, setSearchWasMade] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [chosenIngredient, setChosenIngredient] = useState(null);
  const [chosenIngredientData, setChosenIngredientData] = useState(null);
  const [chosenIngredientAmount, setChosenIngredientAmount] = useState(100);

  const onAcceptIngredient = () => {
    if (lastFromEdamam) {
      const mealIngredient = {
        quantityGrams: chosenIngredientAmount,
        name: chosenIngredient.label,
        photo: chosenIngredient.photo,
      };
      mealIngredient.nutrients = Object.keys(
        chosenIngredientData.totalNutrients
      ).map((key) => {
        const nutrientEntry = chosenIngredientData.totalNutrients[key];
        return {
          code: key,
          label: nutrientEntry.label,
          quantity: nutrientEntry.quantity,
          unit: nutrientEntry.unit,
        };
      });

      console.log("mealIngredient");
      console.log(mealIngredient);
      onAddIngredient(mealIngredient);
    } else {
      const { name, nutrients, photo } = chosenIngredient;

      const nutruentsNoIds = nutrients.map((nutrient) => {
        const { _id, ...rest } = nutrient;
        return rest;
      });

      const ingredientToAdd = {
        name,
        nutrients: nutruentsNoIds,
        photo,
        quantityGrams: chosenIngredientAmount,
      };

      console.log("ingredientToAdd");
      console.log(ingredientToAdd);
      onAddIngredient(ingredientToAdd);
    }

    setSearchQuery("");
    setSearchWasMade(false);
    setSearchResults(null);
    setChosenIngredient(null);
    setChosenIngredientData(null);
    setChosenIngredientAmount(100);
  };

  const onSearch = () => {
    if (nextFromEdamam) {
      Axios.get(
        `https://api.edamam.com/api/food-database/v2/parser?app_id=0c65f087&app_key=18eeb75562b0c31f4d1da3640e19f270&ingr=${searchQuery}&nutrition-type=cooking&category=generic-foods`
      )
        .then((res) => {
          const foundFoods = res.data.hints.map((hint) => hint.food);
          const uniqueFoods = Object.values(
            foundFoods.reduce((acc, obj) => ({ ...acc, [obj.foodId]: obj }), {})
          );
          uniqueFoods.forEach((food) => {
            food.photo = food.image ?? DEFAULT_IMAGE;
          });
          console.log(uniqueFoods);
          setSearchResults(uniqueFoods);
          setSearchWasMade(true);
          setLastFromEdamam(true);
        })
        .catch((e) => {
          // console.log(e);
        });
    } else {
      Axios.get(`//localhost:3500/ingredients/search/q=${searchQuery}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          console.log(res.data);
          setSearchResults(res.data);
          setSearchWasMade(true);
          setLastFromEdamam(false);
        })
        .catch((e) => {
          // console.log(e);
          // console.log(token);
        });
    }
  };

  const onSelectIngredient = (ingredient) => {
    setSearchQuery("");
    setSearchResults(null);

    if (nextFromEdamam) {
      setChosenIngredient({
        ...ingredient,
        photo: ingredient.image ?? DEFAULT_IMAGE,
      });

      Axios.post(
        `https://api.edamam.com/api/food-database/v2/nutrients?app_id=0c65f087&app_key=18eeb75562b0c31f4d1da3640e19f270`,
        {
          ingredients: [
            {
              quantity: 1,
              measureURI: GRAM_UNIT_URL,
              qualifiers: [],
              foodId: ingredient.foodId,
            },
          ],
        }
      )
        .then((res) => {
          const ingredientData = res.data;
          setChosenIngredientData(ingredientData);
          console.log(res.data);
        })
        .catch((e) => {
          // console.log(e);
        });
    } else {
      console.log(ingredient);
      setChosenIngredient(ingredient);
      setChosenIngredientData(ingredient);
    }
  };

  return (
    <List disablePadding>
      {!chosenIngredient ? (
        <>
          <ListItem>
            <FormControl>
              <FormLabel style={{ color: "black" }}>
                <h3>Ingredient data from:</h3>
              </FormLabel>
              <RadioGroup name="radio-buttons-group">
                <FormControlLabel
                  value={true}
                  control={<Radio />}
                  label="Edamam's Food & Grocery API"
                  onChange={() => {
                    setNextFromEdamam(true);
                  }}
                  checked={nextFromEdamam}
                />
                <FormControlLabel
                  value={false}
                  control={<Radio />}
                  label="My custom ingredients"
                  onChange={() => {
                    setNextFromEdamam(false);
                  }}
                  checked={!nextFromEdamam}
                />
              </RadioGroup>
            </FormControl>
          </ListItem>

          <ListItem>
            <TextField
              label={"Search"}
              type="text"
              value={searchQuery}
              placeholder="Ingredient name"
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ m: "10px" }}
              fullWidth
            />
            <Button variant="contained" onClick={onSearch}>
              <Search />
            </Button>
          </ListItem>
          <ListItem style={{ maxHeight: "70vh", overflowY: "auto" }}>
            {searchResults === null || searchResults.length === 0 ? (
              <h3 style={{ color: "rgb(220,0,0)" }}>
                {searchWasMade ? "No matching ingredients found" : null}
              </h3>
            ) : (
              <Grid
                container
                spacing={3}
                marginTop={"5px"}
                style={{ maxHeight: "70vh" }}
              >
                {searchResults.map((food) => {
                  return (
                    <Grid item key={food.foodId} xs={3}>
                      <Card style={{ minHeight: "100%" }}>
                        <CardActionArea
                          onClick={() => onSelectIngredient(food)}
                        >
                          <CardMedia
                            component="img"
                            height="140"
                            image={food.photo ? food.photo : DEFAULT_IMAGE}
                            alt={food.label}
                          />
                          <CardContent style={{ padding: "3px" }}>
                            <Typography
                              gutterBottom
                              variant="h6"
                              align="center"
                              component="div"
                              margin={0}
                            >
                              {lastFromEdamam ? food.label : food.name}
                            </Typography>
                            <List>
                              {(lastFromEdamam
                                ? Object.entries(food.nutrients)
                                : food.nutrients
                              ).map((nutrient, index) => {
                                const nutrientCode = lastFromEdamam
                                  ? nutrient[0]
                                  : nutrient.code;
                                const nutrientAmount = lastFromEdamam
                                  ? nutrient[1]
                                  : nutrient.quantity * 100;
                                if (
                                  !BASIC_NUTRIENTS_CODES.includes(nutrientCode)
                                ) {
                                  return null;
                                }
                                return (
                                  <div key={index}>
                                    {index !== 0 ? <Divider /> : null}
                                    <ListItem
                                      sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                      }}
                                    >
                                      <span>
                                        {NUTRIENTS.find(
                                          (n) => n.code === nutrientCode
                                        ).label ?? nutrientCode}
                                      </span>
                                      <span>{nutrientAmount}</span>
                                    </ListItem>
                                  </div>
                                );
                              })}
                            </List>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </ListItem>
        </>
      ) : chosenIngredientData ? (
        <Card>
          {chosenIngredient.photo ? (
            <CardMedia
              component="img"
              image={chosenIngredient.photo}
              alt={
                lastFromEdamam ? chosenIngredient.label : chosenIngredient.name
              }
              sx={{
                maxHeight: "200px",
                minHeight: "200px",
                objectFit: "contain",
              }}
            />
          ) : null}
          <Typography gutterBottom variant="h5" component="div">
            {lastFromEdamam ? chosenIngredient.label : chosenIngredient.name}
          </Typography>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <List style={{ width: "80%", alignSelf: "center" }}>
              <ListItem>
                <TextField
                  fullWidth
                  label={"Amount in grams"}
                  type="number"
                  value={chosenIngredientAmount}
                  onChange={(e) =>
                    setChosenIngredientAmount(Math.max(1, e.target.value))
                  }
                  InputProps={{
                    inputProps: {
                      min: 1,
                    },
                  }}
                />
                <Button
                  onClick={onAcceptIngredient}
                  color="success"
                  variant="contained"
                >
                  Add
                </Button>
              </ListItem>
              {(lastFromEdamam
                ? Object.keys(chosenIngredientData.totalNutrients)
                : chosenIngredient.nutrients
              ).map((nutrient, index) => {
                const nutrientEntry = lastFromEdamam
                  ? chosenIngredientData.totalNutrients[nutrient]
                  : nutrient;
                return (
                  <div key={index}>
                    {index !== 0 ? <Divider /> : null}
                    <ListItem
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>{nutrientEntry.label}:</span>
                      <span>
                        {(chosenIngredientAmount * nutrientEntry.quantity)
                          .toFixed(3)
                          .toString()}
                        {nutrientEntry.unit}
                      </span>
                    </ListItem>
                  </div>
                );
              })}
            </List>
          </div>
        </Card>
      ) : null}
    </List>
  );
};
