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

export const NewIngredient = ({ onAddIngredient }) => {
  const [fromEdamam, setFromEdamam] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchWasMade, setSearchWasMade] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [chosenIngredient, setChosenIngredient] = useState(null);
  const [chosenIngredientData, setChosenIngredientData] = useState(null);
  const [chosenIngredientAmount, setChosenIngredientAmount] = useState(1);

  const onAcceptIngredient = () => {
    if (fromEdamam) {
      const mealIngredient = {
        quantityGrams: chosenIngredientAmount,
        name: chosenIngredient.label,
      };
      mealIngredient.nutrients = Object.keys(
        chosenIngredientData.totalNutrients
      ).map((key) => {
        const nutrientEntry = chosenIngredientData.totalNutrients[key];
        return {
          code: key,
          label: nutrientEntry.label,
          quantity: nutrientEntry.quantity.toPrecision(3),
          unit: nutrientEntry.unit,
        };
      });
      onAddIngredient(mealIngredient);

      setSearchQuery("");
      setSearchWasMade(false);
      setSearchResults(null);
      setChosenIngredient(null);
    }
  };

  const onSearch = () => {
    if (fromEdamam) {
      Axios.get(
        `https://api.edamam.com/api/food-database/v2/parser?app_id=0c65f087&app_key=18eeb75562b0c31f4d1da3640e19f270&ingr=${searchQuery}&nutrition-type=cooking&category=generic-foods`
      )
        .then((res) => {
          const foundFoods = res.data.hints.map((hint) => hint.food);
          const uniqueFoods = Object.values(
            foundFoods.reduce((acc, obj) => ({ ...acc, [obj.foodId]: obj }), {})
          );
          console.log(uniqueFoods);
          setSearchResults(uniqueFoods);
          setSearchWasMade(true);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  const onSelectIngredient = (ingredient) => {
    setSearchQuery("");
    setSearchResults(null);
    setChosenIngredient(ingredient);

    if (fromEdamam) {
      Axios.post(
        `https://api.edamam.com/api/food-database/v2/nutrients?app_id=0c65f087&app_key=18eeb75562b0c31f4d1da3640e19f270`,
        {
          ingredients: [
            {
              quantity: 1,
              measureURI:
                "http://www.edamam.com/ontologies/edamam.owl#Measure_gram",
              qualifiers: [],
              foodId: ingredient.foodId,
            },
          ],
        }
      )
        .then((res) => {
          const ingredientData = res.data;
          setChosenIngredientData(ingredientData);
          console.log(ingredient);
          console.log(res.data);
        })
        .catch((e) => {
          console.log(e);
        });
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
                    setFromEdamam(true);
                  }}
                  checked={fromEdamam}
                />
                <FormControlLabel
                  value={false}
                  control={<Radio />}
                  label="My custom ingredients"
                  onChange={() => {
                    setFromEdamam(false);
                  }}
                  checked={!fromEdamam}
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
          <ListItem>
            {searchResults === null || searchResults.length === 0 ? (
              <h3 style={{ color: "rgb(220,0,0)" }}>
                {searchWasMade ? "No matching ingredients found" : null}
              </h3>
            ) : (
              <Grid container spacing={3} marginTop={"5px"}>
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
                            image={
                              food.image
                                ? food.image
                                : "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"
                            }
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
                              {food.label}
                            </Typography>
                            <List>
                              {Object.entries(food.nutrients).map(
                                (key, index) => {
                                  return (
                                    <div key={index}>
                                      {index !== 0 ? <Divider /> : null}
                                      <ListItem
                                        sx={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <span>{key[0]}</span>
                                        <span>{key[1]}</span>
                                      </ListItem>
                                    </div>
                                  );
                                }
                              )}
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
          {chosenIngredient.image ? (
            <CardMedia
              component="img"
              image={chosenIngredient.image}
              alt={chosenIngredient.label}
              sx={{
                maxHeight: "200px",
                minHeight: "200px",
                objectFit: "contain",
              }}
            />
          ) : null}
          <Typography gutterBottom variant="h5" component="div">
            {chosenIngredient.label}
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
              {Object.keys(chosenIngredientData.totalNutrients).map(
                (nutrient, index) => {
                  return (
                    <div key={index}>
                      {index !== 0 ? <Divider /> : null}
                      <ListItem
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span>
                          {chosenIngredientData.totalNutrients[nutrient].label}:
                        </span>
                        <span>
                          {(
                            chosenIngredientAmount *
                            chosenIngredientData.totalNutrients[nutrient]
                              .quantity
                          )
                            .toFixed(3)
                            .toString()}
                          {chosenIngredientData.totalNutrients[nutrient].unit}
                        </span>
                      </ListItem>
                    </div>
                  );
                }
              )}
            </List>
          </div>
        </Card>
      ) : null}
    </List>
  );
};
