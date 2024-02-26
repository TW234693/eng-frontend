import { Profile } from "./Profile";
import Axios from "axios";
import { Route, Navigate, useNavigate, Routes } from "react-router-dom";
import { Login } from "../views/Login";
import { AssignNewClient } from "../views/AssignNewClient";
import { Register } from "../views/Register";
import { NotLoggedIn } from "../views/NotLoggedIn";
import { ClientDetails } from "../views/ClientDetails";
import React, { useEffect, useState, useCallback } from "react";
import { Header } from "./Header";
import { TestComponent } from "./TestComponent";
import { AddOrEditMeal } from "../views/AddMeal";
import { UserClientList } from "../views/UserClientList";
import { Home } from "../views/Home";
import { UserIngredientList } from "../views/UserIngredientList";
import { Community } from "../views/Community";
import { MyMealsCalendar } from "../views/MyMealsCalendar";
import { MealTemplates } from "../views/MealTemplates";

export const NavigationManager = () => {
  const navigation = useNavigate();

  // const [loggedIn, setLoggedIn] = useState(false);
  const [loggedInProfile, setLoggedInprofile] = useState(null);
  const [isClient, setIsClient] = useState(null);

  const [loggedInToken, setLoggedInToken] = useState(null);

  const onLogOut = useCallback(() => {
    console.log("logging out");
    localStorage.removeItem("roles");
    localStorage.removeItem("email");
    localStorage.removeItem("token");
    // setLoggedIn(false);
    setLoggedInprofile(null);
    setIsClient(null);
    setLoggedInToken(null);
    if (
      !window.location.href.endsWith("/login") &&
      !window.location.href.endsWith("/register") &&
      !window.location.href.endsWith("/community")
    ) {
      navigation("/login", { replace: true });
    }
  }, [navigation]);

  const onLogIn = useCallback(
    (email, roles, token, justLoggedIn) => {
      // if (token === loggedInToken && loggedInProfile.email === email && roles) {
      //   return;
      // }
      Axios.get(
        `//localhost:3500/${
          roles.includes("user") ? `search` : `clients/getClient`
        }/email=${email}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
        .then((res) => {
          console.log("loggin in");
          setIsClient(roles.includes("user") ? false : true);
          // setLoggedIn(true);
          setLoggedInprofile(res.data);
          console.log(res);
          setLoggedInToken(token);
          if (justLoggedIn) {
            navigation("/home", {
              replace: true,
            });
          }
        })
        .catch(() => {
          console.log("Something went wrong while fetching profile info.");
          onLogOut();
        });
    },
    [navigation, onLogOut]
  );

  const checkLoggedInState = useCallback(() => {
    const email = localStorage.getItem("email");
    const token = localStorage.getItem("token");
    const roles = localStorage.getItem("roles");

    console.log("checking logged in state");

    if (email && token && roles) {
      onLogIn(email, roles, token, false);
    } else if (!email || !token || !roles) {
      onLogOut();
    }
  }, [onLogOut, onLogIn]);

  useEffect(() => {
    const checkLoggedInState = () => {
      const email = localStorage.getItem("email");
      const token = localStorage.getItem("token");
      const roles = localStorage.getItem("roles");

      console.log("checking logged in state USE EFFECT");

      if (email && token && roles) {
        onLogIn(email, roles, token, false);
      } else if (!email || !token || !roles) {
        onLogOut();
      }
    };

    checkLoggedInState();
  }, [onLogIn, onLogOut]);

  return (
    <>
      <Header
        profile={loggedInProfile}
        onLogOut={onLogOut}
        navigation={navigation}
        isClient={isClient}
      ></Header>
      <div style={{ padding: "20px" }}>
        <Routes>
          <Route index element={<Navigate to="/register" replace />} />
          <Route
            path="/login"
            element={
              <Login
                onLogIn={onLogIn}
                isLoggedIn={
                  isClient !== null &&
                  loggedInProfile !== null &&
                  loggedInToken !== null
                }
              />
            }
          />
          <Route
            path="/register"
            element={
              <Register
                navigation={navigation}
                isLoggedIn={
                  isClient !== null &&
                  loggedInProfile !== null &&
                  loggedInToken !== null
                }
              />
            }
          />
          <Route
            path="/home"
            element={
              <Home
                checkLoggedInState={checkLoggedInState}
                isClient={isClient}
                token={loggedInToken}
                profile={loggedInProfile}
              />
            }
          />
          <Route
            path="/myProfile"
            element={
              <Profile
                checkLoggedInState={checkLoggedInState}
                isClient={isClient}
                token={loggedInToken}
                profile={loggedInProfile}
              />
            }
          />
          <Route
            path="/myClients"
            element={
              <UserClientList
                checkLoggedInState={checkLoggedInState}
                email={
                  loggedInProfile && loggedInProfile.email
                    ? loggedInProfile.email
                    : ""
                }
                token={loggedInToken}
              />
            }
          />
          <Route
            path="/myIngredients"
            element={
              <UserIngredientList
                checkLoggedInState={checkLoggedInState}
                email={
                  loggedInProfile && loggedInProfile.email
                    ? loggedInProfile.email
                    : ""
                }
                token={loggedInToken}
              />
            }
          />
          <Route path="/notLoggedIn" element={<NotLoggedIn />} />
          <Route
            path="/assignClient"
            element={
              <AssignNewClient
                navigation={navigation}
                checkLoggedInState={checkLoggedInState}
              />
            }
          />
          <Route
            path="/clientDetails/:id"
            element={<ClientDetails checkLoggedInState={checkLoggedInState} />}
          />
          <Route
            path="/clientDetails/:id/addMeal"
            element={
              <AddOrEditMeal
                checkLoggedInState={checkLoggedInState}
                token={loggedInToken}
              />
            }
          />
          <Route
            path="/addMealTemplate"
            element={
              <AddOrEditMeal
                checkLoggedInState={checkLoggedInState}
                token={loggedInToken}
              />
            }
          />
          <Route
            path="/clientDetails/:id/editMeal/:mealId"
            element={
              <AddOrEditMeal
                token={loggedInToken}
                email={
                  loggedInProfile && loggedInProfile.email
                    ? loggedInProfile.email
                    : ""
                }
              />
            }
          />
          <Route
            path="/editMealTemplate/:mealId"
            element={<AddOrEditMeal token={loggedInToken} />}
          />
          <Route
            path="/community"
            element={
              <Community
                checkLoggedInState={checkLoggedInState}
                loggedIn={loggedInProfile !== null}
              />
            }
          />
          <Route path="/test" element={<TestComponent />} />
          <Route
            path="/myMeals"
            element={
              <MyMealsCalendar
                profile={loggedInProfile}
                token={loggedInToken}
                checkLoggedInState={checkLoggedInState}
              />
            }
          />
          <Route
            path="/myMealTemplates"
            element={
              <MealTemplates
                email={
                  loggedInProfile && loggedInProfile.email
                    ? loggedInProfile.email
                    : ""
                }
                token={loggedInToken}
                checkLoggedInState={checkLoggedInState}
              />
            }
          />
        </Routes>
      </div>
    </>
  );
};
