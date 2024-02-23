import React, { useState, forwardRef } from "react";
import {
  Grid,
  Button,
  Card,
  CardActionArea,
  Dialog,
  DialogContent,
} from "@mui/material";
import moment from "moment";
import { Restaurant } from "@mui/icons-material";
import { MealCalendarEntry } from "./MealCalendarEntry";
import { isEqual } from "lodash";
import Slide from "@mui/material/Slide";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const MealCalendar = ({
  clientMeals,
  clientDetails,
  isEditable = true,
}) => {
  clientMeals = clientMeals.sort((a, b) => {
    return moment(a.mealDate) - moment(b.mealDate);
  });

  const [dialogOpened, setDialogOpened] = useState(false);
  const [dialogMeals, setDialogMeals] = useState([]);
  const openDialog = (meals) => {
    setDialogMeals(meals);
    setDialogOpened(true);
  };

  const closeDialog = () => {
    setDialogOpened(false);
    setDialogMeals([]);
  };

  const [currentMonthStartDate, setCurrentMonthStartDate] = useState(null);
  const [currentMonthDates, setCurrentMonthDates] = useState(null);

  const extendMonthDates = (dates) => {
    if (dates.length > 35) {
      return dates;
    }
    const lastDate = dates[dates.length - 1];
    let dateToAppend = moment(lastDate).clone();
    while (dateToAppend.diff(lastDate, "weeks") < 1) {
      dateToAppend = moment(dateToAppend).add(1, "days");
      dates.push(dateToAppend);
    }
    return dates;
  };

  const onCurrentMonth = () => {
    const nowMoment = moment.utc();
    let startOfMonth = nowMoment.clone().startOf("month");
    setCurrentMonthStartDate(startOfMonth.clone());
    startOfMonth = startOfMonth.startOf("isoWeek");

    const endOfMonth = nowMoment
      .clone()
      .endOf("month")
      .endOf("isoWeek")
      .startOf("day");
    const currentMonthDates = [];
    while (endOfMonth.diff(startOfMonth, "days") >= 0) {
      currentMonthDates.push(startOfMonth);
      startOfMonth = moment(startOfMonth).add(1, "days");
    }
    extendMonthDates(currentMonthDates);
    setCurrentMonthDates(currentMonthDates);
  };

  const onPreviousMonth = () => {
    if (!currentMonthDates) {
      onCurrentMonth();
    }

    console.log(currentMonthStartDate);
    let prevMonthStart = moment(currentMonthStartDate)
      .clone()
      .subtract(1, "months");
    setCurrentMonthStartDate(prevMonthStart.clone());

    const prevMonthEnd = prevMonthStart
      .clone()
      .endOf("month")
      .endOf("isoWeek")
      .startOf("day");

    prevMonthStart.startOf("isoWeek");

    const prevMonthDates = [];

    while (prevMonthEnd.diff(prevMonthStart, "days") >= 0) {
      prevMonthDates.push(prevMonthStart);
      prevMonthStart = moment(prevMonthStart).add(1, "days");
    }
    extendMonthDates(prevMonthDates);
    setCurrentMonthDates(prevMonthDates);
  };

  const onNextMonth = () => {
    if (!currentMonthDates) {
      onCurrentMonth();
    }

    let nextMonthStart = moment(currentMonthStartDate).clone().add(1, "months");
    const nextMonthEnd = nextMonthStart
      .clone()
      .endOf("month")
      .endOf("isoWeek")
      .startOf("day");
    setCurrentMonthStartDate(nextMonthStart.clone());
    nextMonthStart = nextMonthStart.startOf("isoWeek");

    const nextMonthDates = [];

    while (nextMonthEnd.diff(nextMonthStart, "days") >= 0) {
      nextMonthDates.push(nextMonthStart);
      nextMonthStart = moment(nextMonthStart).add(1, "days");
    }
    extendMonthDates(nextMonthDates);
    setCurrentMonthDates(nextMonthDates);
  };

  if (!currentMonthDates) {
    onCurrentMonth();
    return;
  }

  return (
    // <Card style={{ padding: "10px" }}>
    <Grid container>
      <Grid xs={12} item>
        <h3 style={{ margin: "5px 0" }}>
          {currentMonthStartDate.format("MMMM YYYY")}
        </h3>
      </Grid>
      <Grid container justifyContent="space-evenly">
        <Grid item xs={4}>
          <Button onClick={onPreviousMonth} variant="contained">
            Previous month
          </Button>
        </Grid>
        <Grid item xs={4}>
          <Button onClick={onCurrentMonth} variant="contained">
            Current month
          </Button>
        </Grid>
        <Grid item xs={4}>
          <Button onClick={onNextMonth} variant="contained">
            Next month
          </Button>
        </Grid>
      </Grid>
      <Grid container>
        <Grid xs={12 / 7} item>
          <h3>Mon</h3>
        </Grid>
        <Grid xs={12 / 7} item>
          <h3>Tue</h3>
        </Grid>
        <Grid xs={12 / 7} item>
          <h3>Wed</h3>
        </Grid>
        <Grid xs={12 / 7} item>
          <h3>Thu</h3>
        </Grid>
        <Grid xs={12 / 7} item>
          <h3>Fri</h3>
        </Grid>
        <Grid xs={12 / 7} item>
          <h3>Sat</h3>
        </Grid>
        <Grid xs={12 / 7} item>
          <h3>Sun</h3>
        </Grid>
      </Grid>
      <Grid container>
        {currentMonthDates.map((dayOfMonth, i) => {
          const mealsThisDay = clientMeals.filter((meal) => {
            return moment(meal.mealDate).isSame(dayOfMonth, "day");
          });

          return (
            <Grid item xs={12 / 7} key={i}>
              <Card
                style={{
                  color:
                    currentMonthStartDate &&
                    dayOfMonth.isSame(currentMonthStartDate, "month") &&
                    mealsThisDay.length
                      ? "green"
                      : currentMonthStartDate &&
                          dayOfMonth.isSame(currentMonthStartDate, "month")
                        ? "black"
                        : "#BBB",
                  borderRadius: 0,
                  height: "100%",
                }}
              >
                <CardActionArea
                  style={{ height: "100%" }}
                  onClick={() => openDialog(mealsThisDay)}
                >
                  <h3>{`${dayOfMonth.format("DD.MM")}`}</h3>
                  {!mealsThisDay.length ? null : (
                    <Restaurant style={{ marginBottom: "5px" }} />
                  )}
                </CardActionArea>
                <Dialog
                  open={
                    dialogOpened &&
                    isEqual(mealsThisDay, dialogMeals) &&
                    mealsThisDay.length > 0
                  }
                  onClose={closeDialog}
                  style={{ background: "rgba(0,0,0,0.5)" }}
                  TransitionComponent={Transition}
                  fullWidth
                  maxWidth="lg"
                >
                  <DialogContent>
                    <Grid container spacing={4}>
                      {dialogMeals.map((meal, id) => {
                        return (
                          <Grid item xs={6} key={id}>
                            <MealCalendarEntry
                              meal={meal}
                              isEditable={isEditable}
                              clientDetails={clientDetails}
                              style={{ border: "none", boxShadow: "none" }}
                            />
                          </Grid>
                        );
                      })}
                    </Grid>
                  </DialogContent>
                </Dialog>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Grid>
    // </Card>
  );
};
