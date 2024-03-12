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
import "moment/dist/locale/en-gb";
import "moment/dist/locale/pl";
import "moment/dist/locale/es";
import { Restaurant } from "@mui/icons-material";
import { MealCalendarEntry } from "./MealCalendarEntry";
import { isEqual } from "lodash";
import Slide from "@mui/material/Slide";
import { useTranslation } from "react-i18next";

export const Transition = forwardRef(function Transition(props, ref) {
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

  const { t, i18n } = useTranslation();
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
    <Grid container>
      <Grid xs={12} item>
        <h3 style={{ margin: "5px 0" }}>
          {currentMonthStartDate
            .locale(i18n.resolvedLanguage)
            .format("MMMM YYYY")}
        </h3>
      </Grid>
      <Grid container justifyContent="space-evenly">
        <Grid item xs={4}>
          <Button onClick={onPreviousMonth} variant="contained">
            {`${t("calendar_previousMonth")}`}
          </Button>
        </Grid>
        <Grid item xs={4}>
          <Button onClick={onCurrentMonth} variant="contained">
            {`${t("calendar_currentMonth")}`}
          </Button>
        </Grid>
        <Grid item xs={4}>
          <Button onClick={onNextMonth} variant="contained">
            {`${t("calendar_nextMonth")}`}
          </Button>
        </Grid>
      </Grid>
      <Grid container>
        <Grid xs={12 / 7} item>
          <h3>{`${t("calendar_monday")}`}</h3>
        </Grid>
        <Grid xs={12 / 7} item>
          <h3>{`${t("calendar_tuesday")}`}</h3>
        </Grid>
        <Grid xs={12 / 7} item>
          <h3>{`${t("calendar_wednesday")}`}</h3>
        </Grid>
        <Grid xs={12 / 7} item>
          <h3>{`${t("calendar_thursday")}`}</h3>
        </Grid>
        <Grid xs={12 / 7} item>
          <h3>{`${t("calendar_friday")}`}</h3>
        </Grid>
        <Grid xs={12 / 7} item>
          <h3>{`${t("calendar_saturday")}`}</h3>
        </Grid>
        <Grid xs={12 / 7} item>
          <h3>{`${t("calendar_sunday")}`}</h3>
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
                  <h3>{`${dayOfMonth.format(
                    i18n.resolvedLanguage === "pl" ? "DD.MM" : "DD/MM"
                  )}`}</h3>
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
  );
};
